import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import UIIcon   from '../ui/icon.js';
import UIInput  from '../ui/input.js';
import UIMonkey from '../ui/monkey.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    width: 360px;
    color: var(--foreground);
    margin: 0 auto;
  }

  ui-monkey {
    width: 170px;
    margin: 0 auto;
  }

  ui-icon {
    margin-left: 10px;
    cursor: pointer;
    color: #707579;
  }

  div {
    display: flex;
    align-items: baseline;
    justify-content: center;
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
    font-weight: bold;
    max-width: 210px;
    font-weight: normal;
  }`;

const attributes = {};
const properties = {};

/** {ScreenConfirm} @class
  * @description Отображение экрана подтверждения входа
  */
  export default class ScreenConfirm extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-monkey></ui-monkey>
        <div>
          <h1><slot></slot></h1>
          <ui-icon>edit</ui-icon>
        </div>
        <h2>We have sent you an SMS with code</h2>
        <ui-input>Code</ui-input>
      </template>`;

  /** Создание компонента {ScreenConfirm} @constructor
    * @param {object?} details данные для формы
    * {string} details.phone_number телефон пользователя
    * {string} details.phone_code_hash идентификатор смс проверки
    */
    constructor(details) {
      super();
      if (details && typeof details === 'object') this.store(details);
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenConfirm} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const input = $('ui-input', node);

      const {telegram, channel} = locator;

      input.addEventListener('input', async () => {
        const phone_code = input.value;
        if (phone_code.length !== 5) return;
        const {phone_number, phone_code_hash} = this.store();
        const data = {phone_code, phone_number, phone_code_hash};
        const {user} = await telegram.method('auth.signIn', data);
        channel.send('$.auth.user', {user});
      });
      return this;
    }

  /** */
    render(node) {
      const {phone_number} = this.store();
      this.innerText = phone_number;
      return this;
    }
  }

Component.init(ScreenConfirm, 'screen-confirm', {attributes, properties});
