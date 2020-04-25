import Component, {html, css} from '../../script/ui/Component.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import ScreenConversations from '../screen/conversations.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    height: 100%;
  }
  main {
    height: 100%;
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
        <main>
          <screen-conversations></screen-conversations>
          <!-- screen-contacts, etc. -->
        </main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutConversations} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      telegram.save(); // saving auth key will be moved to middleware

      locator.channel.send('header.main', {options: { // переключаем шапку
        menu: true,
        search: true
      }});

      return this;
    }
  }

Component.init(LayoutConversations, 'layout-conversations', {attributes, properties});
