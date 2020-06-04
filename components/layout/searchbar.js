import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import LayoutLoading from './loading.js';
import ScreenSearchbar from '../screen/searchbar.js';
import MediaPreview from '../app/media-preview.js';
/* eslint-enable */

const style = css`
  :host {
    display: flex;
    height: 100wh;
    flex-direction: column;
    width: 320px;
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
export default class LayoutSearchbar extends Component {
  static template = html`
      <template>
        <style>${style}</style>
        <screen-searchbar></screen-searchbar>
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

Component.init(LayoutSearchbar, 'layout-searchbar', {attributes, properties});
