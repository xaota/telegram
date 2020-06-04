import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenHTML} from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: block;
    padding: 0 18px 0 24px;
    margin: 0 -18px;
    border-top: 1px solid var(--edge);
  }

  h1 {
    margin-top: 26px;
    margin-bottom: 35px;
    font-size: 16px;
    font-weight: 500;
    color: var(--foreground-label);
  }`;

const attributes = {
  name(root, value) { updateChildrenHTML(root, 'h1', value); }
};
const properties = {};

/** {UIFieldset} @class
  * @description Отображение группы полей ввода
  */
  export default class UIFieldset extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <h1></h1>
        <slot></slot>
      </template>`;

  /** Создание компонента {UIFieldset} @constructor
    * @param {string?} chaption название группы
    */
    constructor(chaption) {
      super();
      if (chaption) this.name = chaption;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIFieldset} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UIFieldset, 'ui-fieldset', {attributes, properties});
