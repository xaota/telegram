import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UIRadio    from '../ui/radio.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    padding: 0px 18px;
  }

  ui-radio {
    margin-bottom: 32px;
  }`;

const attributes = {};
const properties = {};

/** {ScreenLanguage} @class
  * @description Отображение экрана основных настроек
  */
  export default class ScreenLanguage extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-radio hint="English">English</ui-radio>
        <ui-radio hint="Catalan">Català</ui-radio>
        <ui-radio hint="Dutch">Nederlands</ui-radio>
        <ui-radio hint="French">Français</ui-radio>
        <ui-radio hint="German">Italiano</ui-radio>
        <ui-radio hint="Italian">Deutsch</ui-radio>
        <ui-radio hint="Korean">한국어</ui-radio>
        <ui-radio hint="Malay">Bahasa Melayu</ui-radio>
        <ui-radio hint="Portuguese (Brazil)">Português (Brasil)</ui-radio>
        <ui-radio hint="Russian">Русский</ui-radio>
        <ui-radio hint="Spanish">Español</ui-radio>
        <ui-radio hint="Turkish">Türkçe</ui-radio>
        <ui-radio hint="Ukrainian">Українська</ui-radio>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenLanguage} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenLanguage, 'screen-language', {attributes, properties});
