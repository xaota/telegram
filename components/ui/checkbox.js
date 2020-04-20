import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenProperty} from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon from './icon.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    position: relative;
    padding-left: 53px;
    cursor: pointer;
    font-size: 16px;
    line-height: 18px;
    text-align: left;
  }

  slot {
    display: inline;
    cursor: pointer;
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  span.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid var(--grayTextColor);
  }

  input[type="checkbox"]:checked ~ span.checkmark {
    border-color: var(--blueColor);
    background-color: var(--blueColor);
  }

  input[type="checkbox"] ~ ui-icon {
    display: none;
    position: absolute;
    left: 0;
    top: 0px;
    width: 18px;
    height: 18px;
    color: #fff;
    cursor: pointer;
  }

  input[type="checkbox"]:checked ~ ui-icon {
    display: block;
  }

  span.hint {
    display: none;
    font-size: 14px;
    color: rgb(112, 117, 121);
    margin-top: 5px;
  }

  :host([hint]) span.hint {
    display: block;
  }

  :host([hint]) input[type="checkbox"]:not(:checked) ~ span.hint:before {
    content: 'Dis';
  }

  :host([hint]) input[type="checkbox"]:checked ~ span.hint:before {
    content: 'En';
  }`;

const attributes = {};
const properties = {
  // eslint-disable-next-line no-empty-function
  hint() {},
  checked(root, value) {
    updateChildrenProperty(root, 'input[type="checkbox"]', 'checked', value);
  }
};

/** {UICheckbox} @class
  * @description Отображение поля переключателя-галочки
  */
  export default class UICheckbox extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <label class="check-container">
          <input type="checkbox" />
          <slot></slot>

          <span class="checkmark"></span>
          <ui-icon>check</ui-icon>

          <span class="hint">abled</span>
        </label>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UICheckbox} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UICheckbox, 'ui-checkbox', {attributes, properties});
