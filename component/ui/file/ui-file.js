import Component from '../../../script/Component.js';
import $, {updateChildrenHTML} from '../../../script/DOM.js';
import {normalizeSize} from '../../../script/File.js';
import {formatDate} from '../../../script/helpers.js';
import File from '../../../script/File.js';
import download from '../../../script/download.js';

import UiLoadingPercent from '../loading-percent/ui-percent.js';
import UiIcon from '../icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'ui-file');

const attributes = {}

const properties = {}

const bentColor = {
    '#8C171B': '#70000B',
    '#418FE3': '#2266B6',
};
const colors = [
    '#418FE3',
    '#389237',
    '#8C171B',
    '#F87808',
];

export default class UiFile extends Component {
  constructor({file, date}) {
    super(component);
    this.file = file;
    this.date = date;
  }

  mount(node) {
    updateChildrenHTML(node, '.name', this.file.file_name);
    updateChildrenHTML(node, '.size', normalizeSize(+this.file.document.size));
    updateChildrenHTML(node, '.date', formatDate(this.date));
    // icon content
    const type = this.getType();
    this.img = $('.img', node);
    if (this.file.minithumbnail && this.file.minithumbnail.data) {
        this.img.classList.add('preview');
        this.img.style.backgroundImage = `url("data:image/png;base64, ${this.file.minithumbnail.data}")`;
    } else {
        let colorIndex = -1;
        let usageBent = false;
        if (this.file.file_name) {
            if (['doc', 'txt', 'psd'].includes(type)) {
                colorIndex = 0;
                usageBent = true;
            } else if (['xls', 'csv'].includes(type)) {
                colorIndex = 1;
            } else if (['pdf', 'ppt', 'key'].includes(type)) {
                colorIndex = 2;
                usageBent = true;
            } else if (['zip', 'rar', 'ai', 'mp3', 'mov', 'avi'].includes(type)) {
                colorIndex = 3;
            }
            if (colorIndex === -1) {
                if (type.length !== 0) {
                    colorIndex = type.charCodeAt(0) % colors.length;
                } else {
                    colorIndex = name.charCodeAt(0) % colors.length;
                }
            }
        } else {
            colorIndex = 0;
        }

        this.img.style.setProperty("--file-color", colors[colorIndex]);
        if (usageBent) {
            this.img.style.setProperty("--bent-color", bentColor[colors[colorIndex]]);
        } else {
            this.img.classList.add('preview');
        }
    }
    this.fileState();
    this.img.addEventListener('click', this.onClick)
    return super.mount(node, attributes, properties);
  }

  getType = () => {
      return this.file.file_name.indexOf('.') !== -1 ? this.file.file_name.split(".").pop().toLowerCase() : '';
  };

  fileState = () => {
      const img = this.img;
      const heatBlocks = [];

      const type = this.getType();
      const preview = this.file.minithumbnail && this.file.minithumbnail.data;
      if (!this.file.document.local.is_downloading_active) {
          if (!preview) {
              heatBlocks.push(this.generatePreviewText(type));
          }
          if (!this.file.document.local.is_downloading_completed) {
              const load = new UiIcon('download');
              load.setAttribute('id', 'download');
              heatBlocks.push(load);
          }
      } else {
          const stop = new UiIcon('close');
          stop.setAttribute('id', 'close');
          const loading = new UiLoadingPercent();
          loading.setAttribute('size', 38);
          loading.setAttribute(
              'percent',
              this.getLoadingPercent(this.file.document.size, this.file.document.local.downloaded_size)
          );
          heatBlocks.push(stop);
          heatBlocks.push(loading);
      }
      if (img) {
          img.innerHTML = '';
          heatBlocks.forEach((el) => {
              img.append(el);
          });
      }
  };

  getLoadingPercent = (size, loaded) => {
      return Math.abs(loaded / (size / 100));
  };

  setLoadingPercent = (size, loaded) => {
      const loading = $('ui-loading-percent', this.shadowRoot);
      if (loading) {
          loading.setAttribute('percent', this.getLoadingPercent(size, loaded))
      }
  };

  generatePreviewText = (type) => {
      const div = document.createElement('div');
      div.classList.add('type');
      if (!this.file.document.local.is_downloading_completed) {
          div.classList.add('typeHover');
      }
      if (type.length > 5) {
          div.innerText = `${type.slice(0, 2)}...${type.slice(type.length - 2)}`;
      } else {
          div.innerText = type;
      }
      return div;
  };

  onClick = () => {
      const {local, id} = this.file.document;
      // start download file
      if (!local.is_downloading_active && !local.is_downloading_completed) {
          this.file.document.local.is_downloading_active = true;
          this.fileState();
          File.getFile(
              this.file.document,
              true,
              (file) => {
                  this.setLoadingPercent(file.size, file.local.downloaded_size);
              }
          )
              .then(fileState => {
                  this.file.document = fileState;
                  this.fileState();
              });
          return;
      }
      // stop downloading
      if (local.is_downloading_active) {
          File.stopLoading(id)
              .then(() => {
                  local.is_downloading_active = false;
                  local.downloaded_size = 0;
                  this.fileState();
              });
          return;
      }
      // download file local or open preview
      File.getFile(
          this.file.document
      )
          .then(blob => {
              download(blob, this.file.file_name, this.file.mime_type);
          });
  }

}

Component.init(UiFile, component, {attributes, properties});
