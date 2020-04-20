import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenText} from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon from './icon.js';
/* eslint-enable */

const style = css`
  :host {
    display: grid;
    font-size: 16px;
    grid-template-areas: 'icon text' 'icon caption';
    grid-template-columns: 24px auto;
    grid-column-gap: 32px;
    grid-row-gap: 8px;
  }
  :host([large]) {
    grid-column-gap: 16px;
  }
  ui-icon {
    grid-area: icon;
    width: 24px;
    height: 24px;
  }
  slot {
    display: block;
    grid-area: text;
    white-space: pre-line;
    overflow: overlay; /** ! @todo: */
    line-height: 24px;
  }
  p {
    grid-area: caption;
    color: var(--grayTextColor);
    font-size: 14px;
    margin: 0;
  }`;

const attributes = {
    // side(root, value) {}, // left / right / none=default
    icon(root, value) { updateChildrenText(root, 'ui-icon', value); },
    caption(root, value) { updateChildrenText(root, 'p', value); }
  };
const properties = {
    large() {}
  };

/** {UIProperty} @class
  * @description Отображение кнопки основного действия
  */
  export default class UIProperty extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-icon>close</ui-icon>
        <slot></slot>
        <p></p>
      </template>`;

  /** Создание компонента {UIProperty} @constructor
    * @param {object} [options=null] название иконки
    * @param {string?} options.icon название иконки
    * @param {string?} options.caption название свойства
    * @param {string?} options.text описание свойства
    // * @param {string?} [options.side="none"] сторона показа иконки
    */
    constructor(options = null) {
      super();
      if (!options) return;
      const {icon, caption, text} = options; // {side}
      if (icon)    this.icon = icon;
      if (caption) this.caption = caption;
      if (text)    this.innerText = text;
      // if (side)    this.side = side;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIProperty} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UIProperty, 'ui-property', {attributes, properties});
