import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getSplashScreenMessage$} from '../../state/ui/stream-builders.js';

/* eslint-disable */
import LayoutMain         from './main.js';
import LayoutConversation from './conversation.js';
import LayoutSplashscreen from './layout-splashscreen.js'
/* eslint-enable */

const {map} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }

  layout-main {
    /* max-width: 420px;
    min-width: 420px; */
    width: 26%;
    max-width: 28rem;
    min-width: 21.33333rem;
    color:      var(--foreground);
    background: var(--background-aside);
    border-right: 1px solid var(--edge);
  }

  layout-main[collapsed] {
    min-width: auto;
    width: 6rem;
  }

  layout-conversation {
    width: 100%;
    color:      var(--foreground);
    background-color: var(--background);
  }`;

const attributes = {};
const properties = {};

/** {LayoutMessenger} @class
  * @description Главный
  */
export default class LayoutMessenger extends Component {
  static template = html`
      <template>
        <style>${style}</style>
        <layout-main></layout-main>
        <layout-conversation></layout-conversation>
        <layout-splashscreen></layout-splashscreen>
      </template>`;

  /** Создание компонента {LayoutMessenger} @constructor
    * @param {object?} user данные пользователя
    */
  constructor(user) {
    super();

    const state$ = getState$();
    const user$ = state$
      .pipe(map(R.path(['auth', 'user'])));

    user$.subscribe(user => {
      this.store(user);
    });
  }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutMessenger} текущий компонент
    */
    mount(node) {
    super.mount(node, attributes, properties);
    const splashScreenNode = $('layout-splashscreen', node);

    const state$ = getState$();
    const splashScreenMessage$ = getSplashScreenMessage$(state$);
    splashScreenMessage$.subscribe(message => {
      if (R.isNil(message)) {
        splashScreenNode.style.display = 'none';
      } else {
        splashScreenNode.style.display = 'flex';
      }
    });

    return this;
  }
}

Component.init(LayoutMessenger, 'layout-messenger', {attributes, properties});
