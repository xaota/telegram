import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import UIInput   from '../ui/input.js';
import UIButton  from '../ui/button.js';
import AppAvatar from '../app/avatar.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    width: 360px;
    color: #070707;
    margin: 0 auto;
  }

  .enter-avatar {
    position: relative;
    background: #4ea4f6;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
    width: 160px;
    height: 160px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
    cursor: pointer;
  }

  ui-icon#photo-add {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0.3);
  }

  h1 {
    margin-top: 44px;
    font-size: 32px;
    font-weight: normal;
  }

  h2 {
    margin-top: 13px;
    margin-bottom: 49px;
    font-size: 16px;
    line-height: 21px;
    color: var(--foreground-label);
    max-width: 260px;
    margin-left: auto;
    margin-right: auto;
    font-weight: normal;
  }`;

const attributes = {};
const properties = {};

/** {ScreenRegister} @class
  * @description Отображение экрана входа
  */
  export default class ScreenRegister extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-avatar></app-avatar>
        <h1>Your Name</h1>
        <h2>Enter your name and add a profile picture.</h2>
        <ui-input id="first-name">Name</ui-input>
        <ui-input id="last-name">Last Name (optional)</ui-input>
        <ui-button>Start Messaging</ui-button>
      </template>`;

  // /** Создание компонента {ScreenRegister} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenRegister} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const avatar    = $('app-avatar', node);
      const firstName = $('#first-name', node);
      const lastName  = $('#last-name', node);
      const button    = $('ui-button', node);

      button.addEventListener('click', () => send.call(this, firstName, lastName, avatar));
      return this;
    }
  }

Component.init(ScreenRegister, 'screen-register', {attributes, properties});

// #region [Private]
/** send
  * @this ScreenPassword
  */
  async function send(firstName, lastName, avatar) {
    const {telegram, channel} = locator;
    // const first_name = firstName.value;
  }
// #endregion
