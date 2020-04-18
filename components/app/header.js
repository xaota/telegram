import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon   from '../ui/icon.js';
import UIDrop   from '../ui/drop.js';
import UIMenu   from '../ui/menu.js'; // !
import UISearch from '../ui/search.js';
/* eslint-enable */

const style = css`
  :host {
    height: 60px;
    display: flex;
    align-items: center;
    /* padding-left: 18px;
        width: 100%;
    */
    padding: 0 8px 0 10px;
    box-sizing: border-box;

    justify-content: space-between;
    font-size: 20px;
    font-weight: 400;
    /* margin-left: 22px;
    position: relative; */
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

  ui-search {
    width: 100%;
  }

  :host > ui-icon, ui-search, #menu, #more {
    display: none;
  }

  :host([menu]) #menu { display: block; }
  :host([back]) #back { display: flex; }
  :host([close]) #close { display: flex; }
  :host([search]) ui-search { display: flex; }
  :host([mute]) #mute { display: flex; }
  :host([find]) #find { display: flex; }
  :host([more]) #more { display: block; }

  ui-icon:hover {
    background-color: var(--background-field);
    color: var(--iconHover);
  }

  ::slotted(:not([slot])) {
    display: block;
    width: 100%;
    /* padding-left: 36px;
    padding-left: 24px; */
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

        <ui-drop id="menu">
          <ui-icon>menu</ui-icon>
          <slot name="menu" slot="drop"></slot>
        </ui-drop>

        <ui-icon id="back">back</ui-icon>
        <ui-icon id="close">close</ui-icon>

        <ui-search>Search</ui-search>
        <slot></slot>
        <!-- pinned message, subscribe button, player? -->

        <ui-icon id="mute">mute</ui-icon> <!-- mute-off -->
        <ui-icon id="find">search</ui-icon>

        <ui-drop id="more" right show>
          <ui-icon>more</ui-icon>
          <!-- <slot name="more" slot="drop"></slot> -->
          <ui-menu slot="drop">
            <ui-item icon="group">Leave</ui-item>
            <ui-item icon="mute">Mute</ui-item>
          </ui-menu>
        </ui-drop>
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
      // /** @type HTMLSlotElement */
      // const slot = $('slot[name="more"]', node);
      // const more = $('#more', node);
      // const drop = $('ui-drop', node);

      // slot.addEventListener('slotchange', () => {
      //   more.style.display = slot.assignedNodes().length > 0
      //     ? 'flex'
      //     : ''; // none
      // });
      // more.addEventListener('click', () => drop.show = !drop.show);

      // const back = $('#back', node);
      // back.addEventListener('click', _ => this.event('back'));
      // // back.addEventListener('click', _ => route(this.getAttribute('back'), drop));

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
