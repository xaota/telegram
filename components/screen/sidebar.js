import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import AppHeader from '../app/header.js';
/* eslint-enable */

const style = css`
  :host {
    color:      var(--foreground);
    background: var(--background-aside);
  }`;

const attributes = {};
const properties = {};

/** {ScreenSidebar} @class
  * @description Отображение раздела беседы
  */
  export default class ScreenSidebar extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-header></app-header>
        (app-messages ? ui-list) > app-message
        <app-field></app-field>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenSidebar} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenSidebar, 'screen-sidebar', {attributes, properties});
