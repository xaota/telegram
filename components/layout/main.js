import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import LayoutLoading       from './loading.js';
import LayoutSettings      from './settings.js';
import LayoutConversations from './conversations.js'; // список чатов
/* eslint-enable */

const style = css`
  :host {
    display: block;
    position: relative;
  }`;

const attributes = {};
const properties = {};

/** {LayoutMain} @class
  * @description Главный экран приложения
  */
  export default class LayoutMain extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <!--
          <layout-loading></layout-loading>
          <layout-settings></layout-settings>
        -->
        <layout-conversations></layout-conversations>

      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutMain} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(LayoutMain, 'layout-main', {attributes, properties});
