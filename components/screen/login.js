import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {sendAuthCode} from '../../state/auth/index.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import UILogo     from '../ui/logo.js';
import UIInput    from '../ui/input.js';
import UIButton   from '../ui/button.js';
// import UICountry  from '../ui/country.js';
import UICheckbox from '../ui/checkbox.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {map, distinctUntilChanged, withLatestFrom, startWith} = rxjs.operators;

const getButtonStyle = R.pipe(
  R.length,
  R.cond([
    [R.equals(0), R.always('none')],
    [R.T, R.always('block')]
  ])
);

const getErrorLabel = R.cond([
  [R.equals('PHONE_NUMBER_INVALID'), R.always('Invalid phone number')],
  [R.T, R.identity]
]);

const getErrorCode = R.pathOr(null, ['auth', 'sendAuthCodeError']);

const getError = R.pipe(
  getErrorCode,
  getErrorLabel
);

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
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenLogin} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      /** @type UIInput */
      const phone  = $('#phone',    node);
      const button = $('ui-button', node);

      const sendingAuthCode$ = getState$()
        .pipe(map(R.pathOr(false, ['auth', 'sendingAuthCode'])))
        .pipe(distinctUntilChanged());

      sendingAuthCode$.subscribe(sending => {
        phone.disabled = sending;
        button.loading = sending;
      });

      const sendAuthCodeError$ = getState$()
        .pipe(map(getError))
        .pipe(distinctUntilChanged());

      sendAuthCodeError$.subscribe(error => {
        console.log(`[form-login] error: ${error}`);
        phone.error = error;
      });

      const phone$ = fromEvent(phone, 'input').pipe(
        map(R.pathOr('', ['detail', 'value'])),
        startWith('')
      );
      const buttonStyle$ = phone$.pipe(map(getButtonStyle));
      buttonStyle$.subscribe(x => {
        button.style.display = x;
      });

      const buttonClick$ = fromEvent(button, 'click');
      const submit$ = buttonClick$.pipe(
        withLatestFrom(phone$),
        map(R.nth(1))
      );

      submit$.subscribe(sendAuthCode);
      return this;
    }
  }

Component.init(ScreenLogin, 'screen-login', {attributes, properties});
