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
        <app-header menu search>
          <ui-menu slot="menu">
            <ui-item icon="group" data-route="form-group">New group</ui-item>
            <ui-item icon="private">Contacts</ui-item>
            <ui-item icon="archive">Archived</ui-item>
            <ui-item icon="favorite" data-route="#favorite">Saved</ui-item>
            <ui-item icon="conversation" data-route="#conversation">Open by ID</ui-item>
            <ui-item icon="settings" data-route="layout-settings">Settings</ui-item>
            <ui-item icon="help" data-route="//telegram.org/support">Help</ui-item>
            <ui-item icon="bulb" data-route="#night-mode">Night Mode</ui-item>
            <ui-item icon="back" data-route="#collapse">Collapse</ui-item>
            <ui-item data-route="layout-icons">Icons</ui-item>
          </ui-menu>
        </app-header>
        <main>
          <screen-conversations></screen-conversations>
          <!-- screen-contacts, etc. -->
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
