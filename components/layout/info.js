import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UILoading from '../ui/loading.js';
/* eslint-enable */

const style = css`
  :host {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
    background: var(--background-alpha);
    backdrop-filter: blur(3px);
  }

  ui-loading {
    width: 80px;
    height: 80px;
  }`;

const attributes = {};
const properties = {};

/** {LayoutLoading} @class
  * @description Отображение блока простого текста
  */
  export default class LayoutLoading extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-loading></ui-loading>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutLoading} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(LayoutLoading, 'layout-loading', {attributes, properties});
