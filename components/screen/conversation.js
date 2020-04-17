import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import AppHeader from '../app/header.js';
/* eslint-enable */

const style = css``;

const attributes = {};
const properties = {};

/** {ScreenConversation} @class
  * @description Отображение раздела беседы
  */
  export default class ScreenConversation extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-header></app-header>
        (app-messages ? ui-list) > app-message
        <app-field></app-field>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenConversation} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenConversation, 'screen-conversation', {attributes, properties});
