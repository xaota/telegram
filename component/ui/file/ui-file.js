import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenHTML} from '../../../script/DOM.js';
import {normalizeSize} from '../../../script/File.js';
import {formatDate} from '../../../script/helpers.js';

import '../loading-percent/ui-percent.js';

const component = Component.meta(import.meta.url, 'ui-file');

const attributes2 = {
    src(root, value) {
        // в зависимост от типа файла рисуем превью
        const img = $('.img', root);
        img.style.setProperty("--file-color", types.pdf.color);
        img.style.setProperty("--bent-color", types.pdf.bent);
    },
    name(root, value) {
        updateChildrenHTML(root, '.name', value);
    },
    size(root, value) {
        updateChildrenHTML(root, '.size', normalizeSize(+value));
    },
    date(root, value) {
        updateChildrenHTML(root, '.date', formatDate(value));
    }
};

const attributes = {}

const properties = {}

// const mimeTypes = {
//     application: {
//         color: '#8C171B',
//         bent: '#70000B',
//     },
//     audio: {
//         color: '#8C171B',
//         bent: '#70000B',
//     },
//     font: {
//         color: '#8C171B',
//         bent: '#70000B',
//     },
//
// };
const typesPreview = {
    pdf: {
        color: '#8C171B',
        bent: '#70000B',
    },
    apk: {
        color: '#389237'
    },
    doc: {
        color: '#418FE3',
        bent: '#2266B6',
    },
    zip: {
        color: '#F87808',
    },
};

const mimeTypes = {
    img: ['png', 'jpg', 'jpeg'],
};

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
    const type = this.file.file_name.split(".").pop().toLowerCase();
    const img = $('.img', node);
    if (mimeTypes.img.includes(type)) {
        img.classList.add('preview');
        img.style.backgroundImage = `url("data:image/png;base64, ${this.file.minithumbnail.data}")`;
    } else {
        img.style.setProperty("--file-color", typesPreview.pdf.color);
        img.style.setProperty("--bent-color", typesPreview.pdf.bent);
    }
    return super.mount(node, attributes, properties);
  }

  fileState = () => {
  }
}

Component.init(UiFile, component, {attributes, properties});
