import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenHTML} from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon from './icon.js';
/* eslint-enable */

const style = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    cursor: pointer;
    height: 56px;
    padding: 0 16px;
    font-size: 15px;
    width: 100%;
    color: var(--foreground);
    box-sizing: border-box;
  }

  :host(:hover) {
    background-color: var(--background-aside-hover);
  }

  ui-icon {
    height: 24px;
    width: 24px;
    margin-right: 30px;
    color: var(--iconStatic);
  }

  slot {
    display: inline-block;
    white-space: nowrap;
    padding-right: 16px;
  }

  :host(:hover) ui-icon {
    color: var(--iconHover);
  }

  :host(:focus-within) ui-icon {
    color: var(--iconActive);
  }`;

const attributes = {
  icon(root, value) { updateChildrenHTML(root, 'ui-icon', value); }
};
const properties = {};

/** {UIItem} @class
  * @description Отображение компонента списка-меню
  */
  export default class UIItem extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-icon></ui-icon>
        <slot></slot>
      </template>`;

  /** Создание компонента {UIItem} @constructor
    * @param {string?} text содержимое элемента
    * @param {string?} icon название иконки
    */
    constructor(text, icon) {
      super();
      if (text) this.innerText = text;
      if (icon) this.icon = text;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIItem} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UIItem, 'ui-item', {attributes, properties});
