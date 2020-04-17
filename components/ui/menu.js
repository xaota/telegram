import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: #dadce0;
    border-radius: 50%;
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    z-index: 30;
  }

  slot {
    display: none;
  }

  ui-icon {
    width: 24px;
    height: 24px;
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
        <ui-icon></ui-icon>
      </template>`;

  /** Создание компонента {UIMenu} @constructor
    * @param {string?} name название иконки
    */
    constructor(name) {
      super();
      if (name) this.innerText = name;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIMenu} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const slot = $('slot', node);
      const icon = $('ui-icon', node);
      slot.addEventListener('slotchange', _ => icon.innerText = this.innerText || this.innerHTML);
      return this;
    }
  }

Component.init(UIMenu, 'ui-menu', {attributes, properties});
