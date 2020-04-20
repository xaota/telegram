import Component, {html, css} from '../../script/ui/Component.js';
import {updateChildrenProperty, updateChildrenText} from '../../script/ui/DOM.js';

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
    border-radius: 50%;
    border: 1px solid var(--grayTextColor);
    /* box-shadow: var(--grayTextColor) 0 0 0 0.5px; */
  }

  input[type="checkbox"]:checked ~ span.checkmark {
    border-color: #4ea4f6;
    /* box-shadow: #4ea4f6 0 0 0 0.5px; */
  }

  input[type="checkbox"] ~ span.checkmark::after {
    content: '';
    width: 10px;
    height: 10px;
    position: absolute;
    background-color: #4ea4f6;
    top: 3px;
    left: 3px;
    display: none;
    border-radius: 50%;
  }

  input[type="checkbox"]:checked ~ span.checkmark::after {
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
  }`;

const attributes = {
  hint(root, value) { updateChildrenText(root, 'span.hint', value); }
};
const properties = {
  checked(root, value) {
    updateChildrenProperty(root, 'input[type="checkbox"]', 'checked', value);
  }
};

/** {UIRadio} @class
  * @description Отображение поля переключателя-radio
  */
  export default class UIRadio extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <label class="check-container">
          <input type="checkbox" />
          <slot></slot>
          <span class="checkmark"></span>
          <span class="hint">abled</span>
        </label>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIRadio} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(UIRadio, 'ui-radio', {attributes, properties});
