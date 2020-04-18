import Component, {html, css} from '../../script/ui/Component.js';
// import $ from '../../script/ui/DOM.js';

// eslint-disable
// import UIIcon from './icon.js';
// eslint-enable

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: center;
    color: rgb(112, 117, 121);
    font-size: 16px;
    font-weight: 500;
    height: 40px;
    cursor: pointer;
  }

  div {
    width: 100%;
    height: 4px;
    background-color: rgb(78, 164, 246);
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    visibility: hidden;
    margin-top: 11px;
    margin-bottom: -1px;
  }
  :host([selected]) div {
    visibility: visible;
    color: rgb(78, 164, 246);
  }

  slot {
    margin-bottom: 10px;
    white-space: nowrap;
  }`;

const attributes = {};
const properties = {};

/** {UITab} @class
  * @description Отображение вкладки
  */
  export default class UITab extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
        <div></div>
      </template>`;

  // /** Создание компонента {UITab} @constructor
  //   * @param {string?} name название иконки
  //   */
  //   constructor(name) {
  //     super();
  //     if (name) this.innerText = name;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UITab} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(UITab, 'ui-tab', {attributes, properties});
