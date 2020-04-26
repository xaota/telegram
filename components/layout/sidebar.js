import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import LayoutLoading from './loading.js';
import ScreenSidebar from '../screen/sidebar.js';
import MediaPreview from '../app/media-preview.js';
/* eslint-enable */

const style = css`
  :host {
    display:    block;
    height: 100wh;
    overflow-y: auto;
    position:   relative;
    color:      var(--foreground);
    background: var(--background-aside);
  }
`;

const attributes = {};
const properties = {};

/** {LayoutSidebar} @class
  * @description Отображение блока дополнительной информации
  */
  export default class LayoutSidebar extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <!-- <layout-loading></layout-loading> -->
        <screen-sidebar></screen-sidebar>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutSidebar} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(LayoutSidebar, 'layout-sidebar', {attributes, properties});
