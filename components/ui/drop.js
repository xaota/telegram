import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: inline-block;
    position: relative;
  }

  main {
    display: block;
    position: absolute;
    z-index: 40;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease 0s;
    left: 0;
    top: 100%;

    /* box-sizing: border-box; */
    background-color: var(--drop);
    box-shadow: var(--shadow) 0 0 10px;
    border: 1px solid var(--edge);
    border-radius: 10px;
  }

  :host([up]) main {
    top: auto;
    bottom: 100%;
    transform: translateY(10px);
  }

  :host([right]) main {
    left: auto;
    right: 0;
  }

  :host([show]) main {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
  }`;

const attributes = {};
const properties = {
  /* eslint-disable no-empty-function */
    show(root, value) {  }
  /* eslint-enable */
  };

/** {UIDrop} @class
  * @description Отображение кнопки основного действия
  */
  export default class UIDrop extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
        <main><slot name="drop"></slot></main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIDrop} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(UIDrop, 'ui-drop', {attributes, properties});
