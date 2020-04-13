import Component, {html, css} from '../../script/ui/Component.js';

const style = css`
  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    padding: 0px 18px;
  }`;

const attributes = {};
const properties = {};

/** {ScreenSecurity} @class
  * @description Отображение экрана основных настроек
  */
  export default class ScreenSecurity extends Component {
    static template = html`
      <template>
        <style>${style}</style>

      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenSecurity} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenSecurity, 'screen-security', {attributes, properties});
