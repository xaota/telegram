import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {buildInput$} from '../../script/helpers.js';
import {signUp} from '../../state/auth/index.js';

/* eslint-disable */
import UIInput   from '../ui/input.js';
import UIButton  from '../ui/button.js';
import AppAvatar from '../app/avatar.js';
/* eslint-enable */

const {fromEvent, combineLatest} = rxjs;
const {map, withLatestFrom, distinctUntilChanged, startWith, tap} = rxjs.operators;

const buildFirstName = R.set(R.lensProp('firstName'), R.__, {});
const buildLastName = R.set(R.lensProp('lastName'), R.__, {});

const getSignUpError = R.pathOr(null, ['auth', 'signUpError']);

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
      const newAvatar = $('app-avatar', node);
      const firstName = $('#first-name', node);
      const lastName  = $('#last-name', node);
      const submit = $('ui-button', node);

      const firstName$ = buildInput$(firstName).pipe(map(buildFirstName));
      const lastName$ = buildInput$(lastName).pipe(map(buildLastName));
      const info$ = combineLatest(firstName$, lastName$).pipe(map(R.mergeAll));

      const newAvatar$ = fromEvent(newAvatar, 'newAvatar').pipe(
        map(R.prop('detail')),
        startWith(null)
      );

      const click$ = fromEvent(submit, 'click');
      const submit$ = click$
        .pipe(
          withLatestFrom(info$, newAvatar$),
          map(R.pipe(
            R.of,
            R.ap([
              R.nth(1),
              R.pipe(R.nth(2), R.set(R.lensProp('avatar'), R.__, {}))
            ]),
            R.mergeAll
          )),
          tap(console.log)
        );
      submit$.subscribe(signUp);

      const state$ = getState$();

      const signUpError$ = state$
        .pipe(map(getSignUpError))
        .pipe(distinctUntilChanged());

      const firstNameInvalid$ = signUpError$
        .pipe(map(R.equals('FIRSTNAME_INVALID')))
        .pipe(distinctUntilChanged());
      firstNameInvalid$.subscribe(invalid => {
        firstName.error = invalid ? 'First name invalid' : null;
      });

      const lastNameInvalid$ = signUpError$
        .pipe(map(R.equals('LASTNAME_INVALID')))
        .pipe(distinctUntilChanged());

      lastNameInvalid$.subscribe(invalid => {
        lastName.error = invalid ? 'Last name invalid' : null;
      });
      return this;
    }
  }

Component.init(ScreenRegister, 'screen-register', {attributes, properties});

