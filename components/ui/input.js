import Component, {html, css} from '../../script/ui/Component.js';
import $, {
  updateChildrenElement,
  updateChildrenClass,
  updateChildrenHTML,
  updateChildrenProperty,
  updateChildrenAttribute
} from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: block;
    width: 100%;
    height: 54px;
    border: 1px solid #8d969c;
    border-radius: 10px;
    position: relative;
    margin-bottom: 24px;
  }

  :host(:focus-within) {
    border-color: #4ea4f6;
    box-shadow: #4ea4f6 0 0 0 1px;
  }

  :host([error]) {
    border-color: #f6553b;
    box-shadow: #f6553b 0 0 0 1px;
  }

  span.error {
    display: none;
    position: absolute;
    top: -13px;
    left: 10px;
    z-index: 20;
    background: var(--background-aside);
    padding: 4px;
    font-size: 12px;
    color: #f6553b;
  }
  :host([error]) span.error {
    display: block;
  }

  label {
    display: none;
    position: absolute;
    top: -13px;
    left: 10px;
    z-index: 20;
    background: var(--background-aside);
    padding: 4px;
    font-size: 12px;
    color: #8d969c;
  }

  :host(:focus-within) label {
    display: block;
    color: #4ea4f6
  }
  :host([error]:focus-within) label {
    display: none;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    position: relative;
  }

  input {
    color: var(--foreground);
    outline: none;
    display: block;
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    font-size: 16px;
    padding: 0px 14px;
    resize: none;
    /* outline: none; */
  }

  :host([disabled]) {
    opacity: 0.7;
  }`;

const attributes = {
  value(root, value) { updateChildrenElement(root, 'input', 'value', value); },
  error(root, value) {
    updateChildrenClass(root, 'input', {error: Boolean(value)});
    updateChildrenHTML(root, 'span.error', value);
  }
};
const properties = {
  disabled(root, value) { updateChildrenProperty(root, 'input', 'disabled', value); }
};

/** {UIInput} @class
  * @field {boolean} disabled
  * @field {string} value
  * @description Отображение поля ввода текста
  */
  export default class UIInput extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <label><slot></slot></label>
        <span class="error"></span>
        <div><input type="text" /></div>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIInput} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      const slot  = $('slot', node);
      const input = $('input', node);

      slot.addEventListener('slotchange', _ => updateChildrenAttribute(node, 'input', 'placeholder', this.innerText || this.innerHTML));
      input.addEventListener('input', _ => inputHandler.call(this, input, _));
      input.addEventListener('change', _ => this.event('change'));
      input.addEventListener('keydown', e => { if (e.key === 'Enter') return this.event('enter'); });
      this.addEventListener('focus', _ => input.focus());
      return this;
    }
  }

Component.init(UIInput, 'ui-input', {attributes, properties});

// #region [Private]
/** */
  function inputHandler(input, e) {
    e.stopPropagation();
    this.value = input.value;
    this.event('input', {value: input.value});
  }
// #endregion
