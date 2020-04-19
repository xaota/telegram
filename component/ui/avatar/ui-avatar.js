import Component from '../../../script/Component.js';
import {updateChildrenAttribute} from '../../../script/DOM.js';
import File from '../../../script/File.js';

/* eslint-disable */
import UIBadge from '../badge/ui-badge.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'ui-avatar');
const attributes = {
    src(root, value) {
      updateChildrenAttribute(root, 'img', 'src', value);
    },
    color(root, value) {
      this.style.backgroundColor = value;
    }
  };

const properties = {
  online(root, value) { /* do nothing */ }
};

export default class UIAvatar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }

  static from(sender, color, image) { // создание аватара в сообщении
    const avatar = new UIAvatar();
    avatar.innerText = UIAvatar.letter(sender);
    avatar.color = color;
    avatar.setAttribute('slot', 'avatar');

    if (image) File.getFile(image).then(src => avatar.src = src);
    return avatar;
  }

  static letter(value) {
    return value
      .trim()
      .replace(/[\s\-\|\.\,\–\—\/\\\&\$\(\)\[\]\{\}]+/g, ' ') // eslint-disable-line
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
    const colorIndex = Math.abs(id % colors.length);
    return colors[colorIndex];
  }
}

Component.init(UIAvatar, component, {attributes, properties});
