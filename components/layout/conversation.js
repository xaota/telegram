import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import LayoutSidebar      from './sidebar.js';
import ScreenEmpty        from '../screen/empty.js';
import ScreenConversation from '../screen/conversation.js';
/* eslint-enable */

const style = css`
  :host {
    display: grid;
    position: relative;

    grid-template-areas: 'conversation sidebar';
    grid-template-columns: auto 320px; /* minmax(200px, 320px); */
  }

  layout-sidebar {
    /* max-width: 420px;
    min-width: 420px; */
    grid-area: sidebar;
    border-left: 1px solid var(--edge);
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
        <!--
          <screen-empty></screen-empty>
        -->
        <screen-conversation></screen-conversation>
        <layout-sidebar></layout-sidebar>
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
