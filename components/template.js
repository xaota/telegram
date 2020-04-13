import Component, {html, css} from '../script/ui/Component.js';

const style = css`
  :host {
    display: block;
    font-family: var(--font);
  }`;

const attributes = {};
const properties = {};

/** {ComponentTemplate} @class
  * @description Отображение блока простого текста
  */
  export default class ComponentTemplate extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
      </template>`;

  /** Создание компонента {ComponentTemplate} @constructor
    * @param {string?} text содержимое элемента
    */
    constructor(text) {
      super();
      if (text) this.innerText = text;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ComponentTemplate} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

// Эх, декораторы бы
Component.init(ComponentTemplate, 'component-template', {attributes, properties});
