import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenProperty} from '../../script/ui/DOM.js';

/* eslint-disable */
import UILoading from './loading.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    position: relative;
  }

  button {
    outline: none;
    background: var(--blueColor);
    /* #4ea4f6; */
    border-radius: 10px;
    color: #fff;
    border: none;
    font-size: 16px;
    text-transform: uppercase;
    position: relative;
    display: block;
    width: 100%;
    height: 54px;
    cursor: pointer;
  }

  button:hover {
    background: var(--blueColorHover);
  }

  button:active {
    background: var(--blueColorActive);
  }

  ui-loading {
    color: #fff;
    width: 36px;
    height: 36px;
    right: 12px;
    top: 8px;
    position: absolute;
    display: none;
  }

  :host([loading]) ui-loading {
    display: block;
  }`;

const attributes = {};
const properties = {
  // eslint-disable-next-line no-empty-function
  loading() {},
  disabled(root, value) { updateChildrenProperty(root, 'button', 'disabled', value); }
};

/** {UIButton} @class
  * @description Отображение кнопки
  */
  export default class UIButton extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <button><slot></slot></button>
        <ui-loading></ui-loading>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIButton} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UIButton, 'ui-button', {attributes, properties});
