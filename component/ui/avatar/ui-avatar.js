import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute} from '../../../script/DOM.js';

import FileImage from '../../file/image/file-image.js';

const component = Component.meta(import.meta.url, 'ui-avatar');
const attributes = {
    src(root, value) {
      updateChildrenAttribute(root, 'img', 'src', value);
    },
    color(root, value) {
      this.style.backgroundColor = '#' + value;
    }
  };

const properties = {}

export default class UIAvatar extends Component {
  constructor({fileId} = {}) {
    super(component);
    this.fileId = fileId;
  }

  mount(node) {
    if (this.fileId) {
      const remoteImage = new FileImage(this.fileId);
      const img = $('img', node);
      if (img) {
        img.replaceWith(remoteImage);
      }
    }
    return super.mount(node, attributes, properties);
  }

  static letter(value) {
    return value
      .trim()
      .replace(/[\s\-\|\.\,\–\—\/\\\&\$\(\)\[\]\{\}]+/g, ' ')
      .split(/\s+/)
      .slice(0, 2)
      .map(e => e.charAt(0))
      .join('')
      .toUpperCase();
  }

  static color(min = 75, max = 225) {
    const major = rand(min, max);
    const [r,g,b] = shuffle([min, max, major]); // перемешиваем компоненты цвета
    return rgb2hex(r) + rgb2hex(g) + rgb2hex(b);
  }
}

Component.init(UIAvatar, component, {attributes, properties});


/** */
  function rgb2hex(c) {
    return ('00' + c.toString(16)).slice(-2);
  }

/** */
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(0, i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

/** */
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
