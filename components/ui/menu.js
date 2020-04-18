import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
// import UIIcon from './icon.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    padding: 8px 0;
    overflow: hidden;
  }`;

const attributes = {};
const properties = {};

/** {UIMenu} @class
  * @description Отображение выпадающего меню
  */
  export default class UIMenu extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
      </template>`;

  // /** Создание компонента {UIMenu} @constructor
  //   * @param {string?} items пункты меню {icon, text, action()}
  //   */
  //   constructor(items) {
  //     super();
  //     if (items) this.innerText = ...items;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIMenu} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(UIMenu, 'ui-menu', {attributes, properties});
