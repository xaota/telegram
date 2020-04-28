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
    grid-template-columns: calc(3em + 8px) auto calc(3em + 8px);
    justify-items: start;
  }

  :host([right]) {
    grid-template-areas:". content avatar"
                        ". markup .";
    grid-template-columns: calc(3em + 8px) auto calc(3em + 8px);
    justify-items: end;
  }

  slot {
    display: block;
    /* max-width: 80%; */
  }

  slot:not([name]) { /* содержимое сообщения */
    grid-area: content;
    display: flex;
    flex-direction: column-reverse;
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

  
  div.avatar-place {
    grid-area: avatar;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    height: 100%;
  }
  
  :host([left]) div.avatar-place {
    padding-left: 8px;
  }
  
  slot[name="avatar"] {
    display: inline-flex;
    justify-content: center;
    align-content: center;
    width: 40px;
    height 40px;
    grow: 0
  }
  
  slot[name="avatar"] + peer-avatar {
    width: 2rem;
    height: 2rem;
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
        <div class="avatar-place">
            <slot name="avatar"></slot>
        </div>
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
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {AppMessage} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }

  /** форматирование времени / timestamp @static */
    static timestamp(timestamp) {
      if (!timestamp) return '';
      try {
        timestamp = new Date(timestamp * 1000);
        return [timestamp.getHours(), timestamp.getMinutes()]
          .map(e => ('0' + e).slice(-2))
          .join(':');
      } catch (e) {
        debugger; // eslint-disable-line
      }
    }
  }

Component.init(AppMessage, 'app-message', {attributes, properties});

// #region [Private]

// #endregion
