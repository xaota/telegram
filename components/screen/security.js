import Component, {html, css} from '../../script/ui/Component.js';
import locator from '../../script/app/locator.js';

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
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenSecurity} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      locator.channel.send('header.main', {options: { // переключаем шапку
        caption: 'Privacy and Security',
        back: true
      }});

      return this;
    }
  }

Component.init(ScreenSecurity, 'screen-security', {attributes, properties});
