import Component, {html, css} from '../../script/ui/Component.js';

const style = css`
  :host {
    display: block;
    color: #62A4EF;
  }

  svg {
    width: 100%;
    height: 100%;
    animation: rotation 0.4s linear infinite
  }

  svg path {
    fill: currentColor;
  }

  @keyframes rotation {
    100% { transform: rotate(360deg) }
  }`;

const attributes = {};
const properties = {};

/** {UILoading} @class
  * @description Отображение компонента загрузки
  */
  export default class UILoading extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <svg viewBox="0 0 80 80">
          <path d="M40,72C22.4,72,8,57.6,8,40C8,22.4,22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6,28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z" />
        </svg>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UILoading} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UILoading, 'ui-loading', {attributes, properties});
