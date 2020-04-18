import Component, {html, css} from '../../script/ui/Component.js';
// import $ from '../../script/ui/DOM.js';
// import locator from '../../script/app/locator.js';

/* eslint-disable */
import UIFAB           from '../ui/fab.js';
import UIMenu          from '../ui/menu.js';
import UIDrop          from '../ui/drop.js';
import UIItem          from '../ui/item.js';
import UIList          from '../ui/list.js';
import UINetwork       from '../ui/network.js';
import AppConversation from '../app/conversation.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    /* font-size: 15px; */
    height: 100%;
    position: relative;
  }

  /* ui-list {} */

  app-conversation[pin] + app-conversation:not([pin]) {
    position: relative;
    margin-top: 3px;
  }

  app-conversation[pin] + app-conversation:not([pin]):before {
    border-top: 1px solid var(--edge);
    display: block;
    content: '';
    position: absolute;
    top: -3px;
    left: 0;
    right: 0;
  }

  ui-drop {
    position: absolute;
    /* bottom: -54px; */
    bottom: 20px;
    right: 20px;
    transition: .3s ease bottom;
  }

  /* ui-list:hover ~ ui-drop, ui-drop:hover {
    bottom: 20px;
  } */

  /* :host-context(aside[collapsed]) ui-drop {
    right: auto;
    left: 16px;
  } */`;

const attributes = {};
const properties = {};

/** {ScreenConversations} @class
  * @description Отображение экрана списка чатов
  */
  export default class ScreenConversations extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-network updating></ui-network>
        <ui-tabs>
          <ui-tab selected>All chats</ui-tab>
          <ui-tab>Unread</ui-tab>
          <ui-tab>Personal</ui-tab>
          <ui-tab>Groups</ui-tab>
          <!-- <ui-tab>Channels</ui-tab>
          <ui-tab>Bots</ui-tab>
          <ui-tab>Other</ui-tab> -->
        </ui-tabs>
        <ui-list>
          <app-conversation pin></app-conversation>
          <app-conversation pin></app-conversation>
          <app-conversation pin></app-conversation>
          <app-conversation pin></app-conversation>
          <app-conversation pin></app-conversation>
          <app-conversation></app-conversation>
        </ui-list>

        <ui-drop up right>
          <ui-fab>edit</ui-fab>
          <ui-menu slot="drop">
            <ui-item icon="channel" id="fab-channel">New Channel</ui-item>
            <ui-item icon="group" id="fab-group">New Group</ui-item>
            <ui-item icon="private">New Private Chat</ui-item>
          </ui-menu>
        </ui-drop>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenConversations} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      return this;
    }
  }

Component.init(ScreenConversations, 'screen-conversations', {attributes, properties});
