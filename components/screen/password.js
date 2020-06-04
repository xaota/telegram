import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {buildInput$} from '../../script/helpers.js';
import {sendPassword} from '../../state/auth/index.js';

/* eslint-disable */
import UIInput  from '../ui/input.js';
import UIButton from '../ui/button.js';
import UIMonkey from '../ui/monkey.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {withLatestFrom, map, distinctUntilChanged} = rxjs.operators;

const getSendingState = R.pathOr(false, ['auth', 'passwordSending']);
const getSendingError = R.pathOr(null, ['auth', 'passwordError']);

const style = css`
  :host {
    display: block;
    width: 360px;
    color: #070707;
    margin: 0 auto;
  }

  ui-monkey {
    width: 170px;
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
  }`;

const attributes = {};
const properties = {};

/** {ScreenPassword} @class
  * @description Отображение экрана входа
  */
  export default class ScreenPassword extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-monkey>Close</ui-monkey>
        <!-- TwoFactorSetupMonkeyClose.tgs -->
        <h1>Enter a Password</h1>
        <h2>Your account is protected with an additional password.</h2>
        <ui-input type="password">Password</ui-input>
        <ui-button>Next</ui-button>
      </template>`;

  // /** Создание компонента {ScreenPassword} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenPassword} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const input  = $('ui-input', node);
      const submit = $('ui-button', node);

      const input$ = buildInput$(input);

      const state$ = getState$();

      const sendingStatus$ = state$
        .pipe(
          map(getSendingState),
          distinctUntilChanged()
        );
      sendingStatus$.subscribe(status => {
        input.disabled = status;
        submit.loading = status;
      });

      const sendingError$ = state$
        .pipe(
          map(getSendingError),
          distinctUntilChanged()
        );

      sendingError$.subscribe(error => {
        input.error = error;
      });

      const submit$ = fromEvent(submit, 'click')
        .pipe(
          withLatestFrom(input$),
          map(R.nth(1))
        );

      submit$.subscribe(sendPassword);

      return this;
    }
  }

Component.init(ScreenPassword, 'screen-password', {attributes, properties});
