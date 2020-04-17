import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: block;
    position: absolute;
    min-width: 218px;
    border-radius: 10px;
    box-shadow: var(--shadow) 0px 0px 10px;
    z-index: 40;
    background-color: var(--drop);
    padding: 8px 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease 0s;
    left: 0;
    top: 100%;
  }

  :host([up]) {
    top: auto;
    bottom: 100%;
    transform: translateY(10px);
  }

  :host([right]) {
    left: auto;
    right: 0;
  }

  :host([show]) {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
  }`;

const attributes = {};
const properties = {
  /* eslint-disable no-empty-function */
    show(root, value) {  }
  /* eslint-enable */
  };

/** {UIDrop} @class
  * @description Отображение кнопки основного действия
  */
  export default class UIDrop extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
      </template>`;

  /** Создание компонента {UIDrop} @constructor
    * @param {string?} name название иконки
    */
    constructor(name) {
      super();
      if (name) this.innerText = name;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIDrop} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(UIDrop, 'ui-drop', {attributes, properties});
