import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {setPage} from '../../state/pages/index.js';
import {sendVerifyCode} from '../../state/auth/index.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import UIIcon   from '../ui/icon.js';
import UIInput  from '../ui/input.js';
import UIMonkey from '../ui/monkey.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {filter, mapTo, map, distinctUntilChanged} = rxjs.operators;

const goToLogin = R.partial(setPage, ['login']);

const getPhoneNumber = R.path(['auth', 'currentPhone']);

const getVerifyError = R.path(['auth', 'verifyError']);

const getVerifyLabel = R.cond([
  [R.equals('PHONE_CODE_INVALID'), R.always('Invalid code')],
  [R.T, R.identity]
]);

const isValidValue = R.pipe(
  R.prop('length'),
  R.lte(5)
);

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
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenConfirm} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const input = $('ui-input', node);
      const icon = $('ui-icon', node);

      const state$ = getState$();

      const phoneNumber$ = state$
        .pipe(map(getPhoneNumber));

      phoneNumber$
        .subscribe(phoneNumber => {
          this.store({phoneNumber});
        });

      const verifyCodeError$ = state$
        .pipe(map(getVerifyError))
        .pipe(distinctUntilChanged())
        .pipe(map(getVerifyLabel));

      verifyCodeError$
        .subscribe(error => {
          input.error = error || null;
          if (error) {
            input.disabled = false;
            input.value = '';
          }
        });

      const input$ = fromEvent(input, 'input');
      input$
        .pipe(mapTo(input))
        .pipe(map(R.prop('value')))
        .pipe(filter(isValidValue))
        .subscribe(sendVerifyCode);

      const changePhone$ = fromEvent(icon, 'click');
      changePhone$.subscribe(goToLogin);

      return this;
    }

  /** */
    render(node) {
      const {phoneNumber} = this.store();
      this.innerText = phoneNumber;
      return this;
    }
  }

Component.init(ScreenConfirm, 'screen-confirm', {attributes, properties});
