import Component, {html, css} from '../../script/ui/Component.js';
import $, {updateChildrenText} from '../../script/ui/DOM.js';

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
    flex-grow: 1;
    flex-direction: row;
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

  ui-search, #caption {
    width: 100%;
  }

  :host > ui-icon, ui-search, #menu, #more, #caption {
    display: none;
  }

  :host([menu]) #menu { display: block; }
  :host([back]) #back { display: flex; }
  :host([close]) #close { display: flex; }
  :host([search]) ui-search { display: flex; }
  :host([caption]) #caption { display: flex; }
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

const attributes = {
    caption(root, value) { updateChildrenText(root, '#caption', value); }
  };
const properties = {
    /* eslint-disable no-empty-function */
    menu(root, value) {},
    back(root, value) {},
    close(root, value) {},
    search(root, value) {},
    mute(root, value) {},
    find(root, value) {},
    more(root, value) {}
    /* eslint-enable no-empty-function */
  };

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
        <slot name="data"></slot>
        <p id="caption"></p>

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
    * @param {string?} options содержимое элемента
    */
    constructor(options) {
      super();
      if (options) this.store(options);
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {AppHeader} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      const back  = $('#back', node);
      const close = $('#back', node);
      const find  = $('#back', node);
      // const mute = $('#back', node);
      // search

      back .addEventListener('click', () => this.event('back'));
      close.addEventListener('click', () => this.event('close'));
      find .addEventListener('click', () => this.event('find'));
      // mute .addEventListener('click', () => this.event('mute'));
      // search

      return this;
    }

    render(node) {
      this.menu   = false;
      this.back   = false;
      this.close  = false;
      this.search = false;
      this.mute   = false;
      this.find   = false;
      this.more   = false;

      this.caption = null;

      const {options} = this.store();
      // if (!options) return;
      Object
        .keys(options)
        .forEach(key => this[key] = options[key]);

      return this;
    }
  }

Component.init(AppHeader, 'app-header', {attributes, properties});
