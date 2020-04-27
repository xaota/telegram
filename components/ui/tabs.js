import Component, {html, css} from '../../script/ui/Component.js';

// eslint-disable
// eslint-enable

const style = css`
  :host {
    display: block;
    border-bottom: 1px solid var(--edge);
    box-sizing: border-box;
    /*
    overflow: hidden;
    */
    background: #fff;
  }
  slot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 25px;
  }`;

const attributes = {};
const properties = {};

/** {UITabs} @class
  * @description Отображение вкладок
  */
  export default class UITabs extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
      </template>`;

  // /** Создание компонента {UITabs} @constructor
  //   * @param {string?} name название иконки
  //   */
  //   constructor(name) {
  //     super();
  //     if (name) this.innerText = name;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UITabs} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(UITabs, 'ui-tabs', {attributes, properties});
