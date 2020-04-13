import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import UILogo     from '../ui/logo.js';
import UIInput    from '../ui/input.js';
import UIButton   from '../ui/button.js';
// import UICountry  from '../ui/country.js';
import UICheckbox from '../ui/checkbox.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    width: 360px;
    color: var(--foreground-accent);
    margin: 0 auto;
  }

  ui-logo {
    width: 160px;
    height: 160px;
    margin: 0 auto;
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
  }

  ui-checkbox {
    margin-bottom: 32px;
    margin-left: 19px;
  }

  ui-button {
    display: none;
  }`;

const attributes = {};
const properties = {};

/** {ScreenLogin} @class
  * @description Отображение экрана входа
  */
  export default class ScreenLogin extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-logo></ui-logo>

        <h1>Sign in to Telegram</h1>
        <h2>Please confirm your country and enter your phone number.</h2>

        <!-- <ui-country></ui-country> -->
        <ui-input id="country">Country</ui-input>
        <ui-input id="phone">Phone number</ui-input>
        <ui-checkbox checked>Keep me signed in</ui-checkbox>

        <ui-button>Next</ui-button>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenLogin} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      /** @type UIInput */
      const phone  = $('#phone',    node);
      const button = $('ui-button', node);

      phone.addEventListener('input', _ => {
        button.style.display = phone.value.length > 0 ? 'block' : 'none';
      });

      button.addEventListener('click', async () => {
        const phone_number = phone.value;
        phone.disabled = true;
        button.loading = true;
        // sendAuthCode(phoneNumber);

        const {telegram, config, channel} = locator;

        try {
          const {phone_code_hash} = await telegram.method('auth.sendCode', {
            phone_number,
            api_id: config.api.id,
            api_hash: config.api.hash,
            settings: {_: 'codeSettings'}
          });
          channel.send('$.auth.confirm', {phone_number, phone_code_hash});
        } catch (error) {
          phone.disabled = false;
          button.loading = false;
          phone.error = 'Invalid phone number'; // error.message;
        }
      });

      return this;
    }
  }

Component.init(ScreenLogin, 'screen-login', {attributes, properties});
