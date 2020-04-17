import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

import UIIcon from '../ui/icon.js';

const style = css`
  :host {
    height: 60px;
    display: flex;
    align-items: center;
    /* padding-left: 18px; */
    padding: 0 8px 0 10px;
    width: 100%;
    box-sizing: border-box;

    justify-content: space-between;
    font-size: 20px;
    font-weight: 500;
    /* margin-left: 22px; */
    position: relative;
    background: var(--background-aside);
  }

  ui-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    line-height: 44px;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 10px;
    color: var(--iconStatic);
  }

  ui-icon:hover {
    background-color: var(--background-field);
    color: var(--iconHover);
  }

  #more {
    display: none;
  }

  ui-drop {
    right: 8px;
  }

  slot:not([name]) {
    display: block;
    width: 100%;
    /* padding-left: 36px; */
    padding-left: 24px;
    user-select: none;
  }`;

const attributes = {};
const properties = {};

/** {AppHeader} @class
  * @description Отображение блока простого текста
  */
  export default class AppHeader extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-icon id="back">back</ui-icon>
        <slot></slot>
        <ui-drop right>
          <slot name="more"></slot>
        </ui-drop>
        <ui-icon id="more">more</ui-icon>
      </template>`;

  /** Создание компонента {AppHeader} @constructor
    * @param {string?} text содержимое элемента
    */
    constructor(text) {
      super();
      if (text) this.innerText = text;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {AppHeader} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      /** @type HTMLSlotElement */
      const slot = $('slot[name="more"]', node);
      const more = $('#more', node);
      const drop = $('ui-drop', node);

      slot.addEventListener('slotchange', () => {
        more.style.display = slot.assignedNodes().length > 0
          ? 'flex'
          : ''; // none
      });
      more.addEventListener('click', () => drop.show = !drop.show);

      const back = $('#back', node);
      back.addEventListener('click', _ => this.event('back'));
      // back.addEventListener('click', _ => route(this.getAttribute('back'), drop));

      return this;
    }
  }

Component.init(AppHeader, 'app-header', {attributes, properties});

// #region [Private]
/** */
  function route(layout, drop) {
    // channel.send(layout);
    drop.show = false;
  }
// #endregion
