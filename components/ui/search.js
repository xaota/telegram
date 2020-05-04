import Component, {html, css} from '../../script/ui/Component.js';
import $, {updateChildrenAttribute, updateChildrenElement, updateChildrenProperty} from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon from './icon.js';
/* eslint-enable */

const style = css`
  :host {
    flex: 1 50%;
    height: 2.93333rem;
    padding: 0 .8rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 1.46667rem;
    border: 1px var(--edge) solid;
    background-color: var(--field);
  }

  :host(:hover) {
    border-color: var(--foreground-label);
  }

  :host(:focus-within) {
    border-color: var(--iconHover);
  }

  slot {
    display: none;
  }

  input {
    font-weight: 300;
    left: 16px;
    width: 100%;
    padding: 0;
    height: 42px;
    border: none;
    outline-offset: 0;
    outline: none;
    font-size: 20px;
    background-color: transparent;
    color: var(--foreground);
  }

  input:focus {
    left: 16px;
    width: 100%;
    padding: 0;
    height: 35px;
    border: none;
  }

  ui-icon {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: .4rem;
    flex: none;
    color: var(--iconStatic);
    left: 16px;
  }

  :host(:focus-within) ui-icon {
    color: var(--iconHover);
  }`;

const attributes = {
    value(root, value) { updateChildrenElement(root, 'input', 'value', value); }
  };
const properties = {
    disabled(root, value) { updateChildrenProperty(root, 'input', 'disabled', value); }
  };

/** {UISearch} @class
  * @description Отображение кнопки основного действия
  */
  export default class UISearch extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
        <ui-icon>search</ui-icon>
        <input type="search" />
      </template>`;

  /** Создание компонента {UISearch} @constructor
    * @param {string?} name название иконки
    */
    constructor(name) {
      super();
      if (name) this.innerText = name;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UISearch} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const slot  = $('slot', node);
      const input = $('input', node);

      slot.addEventListener('slotchange', _ => updateChildrenAttribute(node, 'input', 'placeholder', this.innerText || this.innerHTML));
      input.addEventListener('input', _ => inputHandler.call(this, input, _));
      input.addEventListener('change', _ => this.event('change'));
      input.addEventListener('keydown', e => { if (e.key === 'Enter') return this.event('enter', {value: input.value}); });
      this.addEventListener('focus', _ => input.focus());
      this.debounced = debounce(value => {
        this.event('ui-search', {value});
      }, 300);
      return this;
    }
  }

Component.init(UISearch, 'ui-search', {attributes, properties});

// #region [Private]
/** */
  function inputHandler(input, e) {
    e.stopPropagation();
    this.value = input.value;
    if (input.value.trim()) {
      input.value = input.value.startsWith('@') ? input.value.substr(1) : input.value;
      this.debounced(input.value);
    }
    this.event('input');
  }

/** */
  export function debounce(func, wait, immediate) {
    let timeout;
    return function(...args) {
        function later() {
            timeout = null;
            if (!immediate) func.apply(this, args);
        }
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
  }
// #endregion
