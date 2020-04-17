import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import AppHeader           from '../app/header.js';
import ScreenConversations from '../screen/conversations.js';
/* eslint-enable */

const style = css`
  :host {
    display: grid;
    height: 100%;
    grid-template-rows: 60px auto;
  }`;

const attributes = {};
const properties = {};

/** {LayoutConversations} @class
  * @description Отображение блока списка чатов
  */
  export default class LayoutConversations extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-header></app-header>
        <main>
          <screen-conversations></screen-conversations>
        </main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutConversations} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(LayoutConversations, 'layout-conversations', {attributes, properties});
