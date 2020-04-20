import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: inline-block;
    position: relative;
  }

  slot {
    display: none;
  }

  span {
    transform-origin: 100% 0%;
    color: rgba(0, 0, 0, 0.87);
    /* background-color: #f48fb1; */
    background-color: #4ccd5e;
    height: 20px;
    display: flex;
    padding: 0 6px;
    flex-wrap: wrap;
    font-size: 0.75rem;
    min-width: 20px;
    box-sizing: border-box;
    transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    align-items: center;
    font-weight: 500;
    line-height: 1;
    align-content: center;
    border-radius: 10px;
    flex-direction: row;
    justify-content: center;
  }

  :host-context([muted]) span {
    background-color: #c4c9cc;
  }

  :host([outline]) span {
    box-shadow: 0 0 0 2px var(--background-aside);
  }

  :host([x="left"]) span {
    right: auto;
    left: 0;
    transform: scale(1) translate(-50%, -50%);
  }
  :host([y="bottom"]) span {
    top: auto;
    bottom: 0;
    transform: scale(1) translate(50%, 0);
  }
  :host([x="left"][y="bottom"]) span {
    right: auto;
    left: 0;
    top: auto;
    bottom: 0;
    transform: scale(1) translate(-50%, 0);
  }

  :host([dot]) span {
    height: 8px;
    padding: 0;
    min-width: 8px;
    border-radius: 4px;
    content: '';
    font-size: 0;
    color: transparent;
  }

  /* :host([dot][outline]) {
    box-sizing: content-box;
  } */

  :host([count="0"]) span, :host([hidden]) span {
    display: none;
  }

  :host([count="0"][zero]) span {
    display: flex;
  }`;

const attributes = {};
const properties = {};

/** {UIBadge} @class
  * @description Отображение логотипа телеграм
  */
  export default class UIBadge extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <span></span>
        <slot></slot>
      </template>`;

  /** Создание компонента {ComponentTemplate} @constructor
    */
    constructor(text) {
      super();
      this.store({value: 0});
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIBadge} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const slot = $('slot', node);
      const span = $('span', node);
      slot.addEventListener('slotchange', _ => {
        const value = parseInt(this.innerText || this.innerHTML, 10);
        const count = badge(value);
        this.store({value});
        span.innerText = count;
        span.style.display = value !== 0
          ? ''
          : 'none';
      });
      return this;
    }
  }

Component.init(UIBadge, 'ui-badge', {attributes, properties});

// #region [Private]
/** */
  function badge(count) {
    return count > 1e6
      ? Math.floor(count / 1e6) + 'M'
      : count > 1e3
        ? Math.floor(count / 1e3) + 'K'
        : count.toString();
  }
// #endregion
