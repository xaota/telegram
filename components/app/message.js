import Component, {html, css} from '../../script/ui/Component.js';
// import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas:". avatar ."
                        ". content ."
                        ". markup .";
    justify-items: center;
    align-items: end;
    grid-column-gap: 4px;
    grid-row-gap: 2px;

    --avatar: 30px;
  }

  :host([left]) {
    grid-template-areas:"avatar content ."
                        ". markup .";
    grid-template-columns: fit-content(var(--avatar)) fit-content(80%) auto;
    justify-items: start;
  }

  :host([right]) {
    grid-template-areas:". content avatar"
                        ". markup .";
    grid-template-columns: auto fit-content(80%) fit-content(var(--avatar));
    justify-items: end;

    margin-right: 3em; /* зато нет аватарки */
  }

  slot {
    display: block;
    /* max-width: 80%; */
  }

  slot:not([name]) { /* содержимое сообщения */
    grid-area: content;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  :host([left]) slot:not([name]) {
    align-items: flex-start;
  }

  :host([right]) slot:not([name]) {
    align-items: flex-end;
  }

  slot:not([name])::slotted(*) {
    margin-top: 4px;
  }

  slot[name="avatar"] {
    grid-area: avatar;

    /* width: 2rem;
    height: 2rem; */

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
  }

  slot[name="markup"] {
    display: inline-block;
    grid-area: markup;
    width: 100%;
  }

  slot[name="markup"]::slotted(*) {
    width: 100%;
  }`;

const attributes = {};
const properties = {};

/** {AppMessage} @class
  * @description Отображение сообщения
  */
  export default class AppMessage extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot name="avatar"></slot>
        <slot></slot>
        <slot name="markup"></slot>
      </template>`;

  // /** Создание компонента {AppMessage} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {AppMessage} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(AppMessage, 'app-message', {attributes, properties});

// #region [Private]

// #endregion
