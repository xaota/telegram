import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute} from '../../../script/DOM.js';

import UIBadge from '../badge/ui-badge.js';

const component = Component.meta(import.meta.url, 'ui-avatar');
const attributes = {
    src(root, value) {
      updateChildrenAttribute(root, 'img', 'src', value);
    },
    color(root, value) {
      this.style.backgroundColor = value;
    },
    letter(root, value) {
      // TODO не обновляется
      $('slot', root).innerHTML = value;
    }
  };

const properties = {
  online(root, value) { /* do nothing */ }
}

export default class UIAvatar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
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

  static color(id) {
    const colors = [
      "#EB4F60",
      "#FF9157",
      "#997AE8",
      "#50C541",
      "#3DC2C1",
      "#409ADB",
      "#FC55A0"
    ];
    if (id >= 0 && id < 7) {
      return id;
    }
    const colorIndex = Math.abs(id % colors.length);
    return colors[colorIndex];
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
