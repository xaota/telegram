import Component, {html, css} from '../../script/ui/Component.js';

const style = css`
  :host {
    display: inline;
    color: var(--blueColor);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }`;

const attributes = {};
const properties = {};

/** {UIOnline} @class
  * @description Отображение информации о нахождении пользователей в сети
  */
  export default class UIOnline extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
        <ui-icon></ui-icon>
      </template>`;

  // /** Создание компонента {UIOnline} @constructor
  //   */
  //   constructor(name) {
  //     super();
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIOnline} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      return this;
    }
  }

Component.init(UIOnline, 'ui-online', {attributes, properties});
