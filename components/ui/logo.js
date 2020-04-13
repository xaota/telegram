import Component, {html, css} from '../../script/ui/Component.js';

const style = css`
  :host {
    display: block;
  }`;

const attributes = {};
const properties = {};

/** {UILogo} @class
  * @description Отображение логотипа телеграм
  */
  export default class UILogo extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <svg viewBox="0 0 240 240" version="1.1">
          <circle fill="#62A4EF" r="120" cy="120" cx="120" />
          <path fill="#fff" d="m44.691 125.87c14.028-7.7268 29.687-14.176 44.318-20.658 25.171-10.617 50.442-21.05 75.968-30.763 4.9664-1.6549 13.89-3.2731 14.765 4.0866-0.47934 10.418-2.4503 20.775-3.8021 31.132-3.4313 22.776-7.3975 45.474-11.265 68.175-1.3326 7.5618-10.805 11.476-16.866 6.6369-14.566-9.8386-29.244-19.582-43.624-29.649-4.7105-4.7863-0.34239-11.66 3.8645-15.078 11.997-11.823 24.72-21.868 36.09-34.302 3.067-7.4061-5.9951-1.1645-8.9842 0.74815-16.424 11.318-32.446 23.327-49.762 33.274-8.845 4.8689-19.154 0.70809-27.995-2.0087-7.9269-3.2821-19.543-6.5888-12.708-11.593z" />
        </svg>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UILogo} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UILogo, 'ui-logo', {attributes, properties});
