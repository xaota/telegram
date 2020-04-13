import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import LayoutEmpty from './empty.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
  }`;

const attributes = {};
const properties = {};

/** {LayoutConversation} @class
  * @description Отображение ряздела общения
  */
  export default class LayoutConversation extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <layout-empty></layout-empty>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutConversation} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(LayoutConversation, 'layout-conversation', {attributes, properties});
