import Component, {html, css} from '../../script/ui/Component.js';
// import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon    from './icon.js';
import UILoading from './loading.js';
/* eslint-enable */

const style = css`
  :host {
    color: #333;
    margin: 0 8px 4px;
    border-radius: 9px;
    display: block;
    overflow: hidden;
    /* max-height: 100px; */
    transition: max-height 0.4s ease-out;
    max-height: 0;
  }

  div {
    padding: 8px;
    display: none;
    align-items: center;
  }

  #connecting {
    background: #F9D970;
  }

  #updating {
    background: var(--iconHover);
  }

  #ready {
    background: #72CA6B;
  }

  :host([connecting]), :host([updating]) {
    max-height: 60px;
  }

  :host([ready]) {
    max-height: 0;
  }

  :host([connecting]) #connecting {
    display: flex;
  }

  :host([updating]) #updating {
    display: flex;
  }

  :host([ready]) #ready {
    display: flex;
  }

  :host-context([collapsed]) div span {
    display: none;
  }

  ui-loading, ui-icon {
    width: 32px;
    height: 32px;
    display: inline-block;
    color: #111;
    margin-right: 2em;
  }

  :host-context([collapsed]) ui-loading,
  :host-context([collapsed]) ui-icon {
    margin: 0 auto;
  }`;

const attributes = {};
const properties = {};

/** {UINetwork} @class
  * @description Отображение кнопки основного действия
  */
  export default class UINetwork extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <div id="connecting">
          <ui-loading></ui-loading>
          <span>Waiting for network...</span>
        </div>
        <div id="updating">
          <ui-loading></ui-loading>
          <span>Updating...</span>
        </div>
        <div id="ready">
          <ui-icon>check</ui-icon>
          <span>Connected!</span>
        </div>
      </template>`;

  /** Создание компонента {UINetwork} @constructor
    * @param {string?} name название иконки
    */
    constructor(name) {
      super();
      if (name) this.innerText = name;
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UINetwork} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      // channel.on('connection.state', ({type}) => {
      //   this.removeAttribute('ready');
      //   this.removeAttribute('updating');
      //   this.removeAttribute('connecting');

      //   this.setAttribute(type, '');
      // });
      return this;
    }
  }

Component.init(UINetwork, 'ui-network', {attributes, properties});
