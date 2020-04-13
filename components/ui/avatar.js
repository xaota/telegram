import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenAttribute} from '../../script/ui/DOM.js';

/* eslint-disable */
import UIBadge from './badge.js';
/* eslint-enable */

const style = css`
  :host {
    /* font-size: 16px; */

    min-width: 2rem;
    min-height: 2rem;
    position: relative;

    color: #fff;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.33333rem;
    text-transform: uppercase;
    isolation: isolate;

    border-radius: 50%;
  }

  :host-context(app-message) {
    font-size: 12px;
  }

  slot {
    display: block;
    /* border-radius: 50%; */
  }

  img {
    display: none;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  slot + img[src] {
    display: block;
  }

  :host([src]) slot {
    display: none;
  }

  ui-badge {
    position: absolute;
    right: 2%;
    bottom: 13%;
    display: none;
  }

  :host([online]) ui-badge {
    display: block;
  }`;

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

/** {UIAvatar} @class
  * @description Отображение логотипа телеграм
  */
  export default class UIAvatar extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
        <img src="" alt="" />
        <ui-badge dot outline></ui-badge>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIAvatar} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }

    static from(sender, color, image) { // создание аватара в сообщении
      const avatar = new UIAvatar();
      avatar.innerText = UIAvatar.letter(sender);
      avatar.color = color;
      avatar.setAttribute('slot', 'avatar');

      // if (image) File.getFile(image).then(src => avatar.src = src);
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
      if (id >= 0 && id < 7) {
        return id;
      }
      const colorIndex = Math.abs(id % colors.length);
      return colors[colorIndex];
    }
  }

Component.init(UIAvatar, 'ui-avatar', {attributes, properties});
