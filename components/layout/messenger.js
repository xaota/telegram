import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import LayoutMain         from './main.js';
import LayoutConversation from './conversation.js';
/* eslint-enable */

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }

  layout-main {
    /* max-width: 420px;
    min-width: 420px; */
    width: 26%;
    max-width: 28rem;
    min-width: 21.33333rem;
    color:      var(--foreground);
    background: var(--background-aside);
    border-right: 1px solid var(--edge);
  }

  layout-main[collapsed] {
    min-width: auto;
    width: 6rem;
  }

  layout-conversation {
    width: 100%;
    color:      var(--foreground);
    background-color: var(--background);
  }`;

const attributes = {};
const properties = {};

/** {LayoutMessenger} @class
  * @description Главный
  */
  export default class LayoutMessenger extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <layout-main></layout-main>
        <layout-conversation></layout-conversation>
      </template>`;

  /** Создание компонента {LayoutMessenger} @constructor
    * @param {object?} user данные пользователя
    */
    constructor(user) {
      super();
      if (user) this.store(user);
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutMessenger} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(LayoutMessenger, 'layout-messenger', {attributes, properties});
