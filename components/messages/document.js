import Component, {html, css} from '../../script/ui/Component.js';
import $, {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: block;
    font-size: 14px;
    --color: var(--foreground-label);
  }

  :host([reply]) {
    font-size: 13px;
  }

  div {
    display: inline-block;
    background: var(--field);
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
    max-width: 40rem;
    text-align: left;
    padding: 8px 6px;
    word-break: break-word;
  }

  :host([left]) div {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background: var(--background-message-in);
  }

  :host([right]) div {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    background: var(--background-message-out);
  }

  /* хвостик */
  :host([left]:last-child) div {
    border-bottom-left-radius: 0;
  }

  :host([right]:last-child) div {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 5px;
  }

  :host([left]:last-child) div::after, :host([left]:last-child) div::before,
  :host([right]:last-child) div::after, :host([right]:last-child) div::before {
    position: absolute;
    width: 12px;
    left: 0;
    transform: translateX(calc(-100% + 2px));
    bottom: 0;
    content: "";
  }

  :host([left]:last-child) div::before,
  :host([right]:last-child) div::before { /* тень хвостика (только вниз пусть будет) */
    height: 1px; /* 0 */
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
  }

  :host([left]:last-child) div::after,
  :host([right]:last-child) div::after { /* хвостик */
    height: 24px;
    background: radial-gradient(ellipse farthest-side at top left, transparent 100%, var(--background-message-in) 100%);
  }

  :host([right]:last-child) div::before,
  :host([right]:last-child) div::after {
    right: 0;
    transform: translateX(calc(100% - 2px));
    left: inherit;
  }

  :host([right]:last-child) div::after {
    background: radial-gradient(ellipse farthest-side at top right, transparent 100%, var(--background-message-out) 100%);
  }

  :host([reply]) div::before,
  :host([reply]) div::after {
    display: none;
  }

  /* ----------------- */

  :host([reply]) div {
    border-left: 2px solid #4ea4f5;
    border-radius: 0;
    box-shadow: none;
    display: block;
    max-width: 100%;
    background: transparent;
    padding-left: 3px;
    position: static;
  }

  slot {
    display: block;
    font-size: 1rem;
    padding: 0 5px;
  }

  slot[name="author"] {
    display: block;
  }

  slot[name="author"]::slotted(span) {
    font-size: 0.93333rem;
    margin-bottom: 2px;
    font-weight: 600;
    line-height: 150%;
    color: var(--color);
  }

  slot[name="content"] {
    /* white-space: pre-wrap; */
  }

  :host([reply]) slot[name="content"]::slotted(span) {
    color: #707579;
  }

  :host([timestamp]) slot[name="content"]::slotted(span):after {
    content: "";
    display: inline-block;
    width: 1.8rem;
  }

  span { /* timestamp */
    position: absolute;
    /* display: block;
    text-align: right; */
    font-size: 0.73333rem;
    color: #a3adb6;
    font-weight: 400;
    right: 6px;
    bottom: 5px;
  }

  :host([reply]) span {
    display: none;
  }

  ui-file {
    padding-right: 3px;
    padding-left: 3px;
  }`;

const attributes = {
  color(root, value) { cssVariable(this, 'color', value); },
  timestamp(root, value) { updateChildrenText(root, 'span', value); }
  // status=received, sended
  // views
  // sign (author)
};
const properties = {
  // edited
};

/** {MessageDocument} @class
  * @description Отображение сообщения c вложением
  */
  export default class MessageDocument extends Component {
    static template = html`
      <template>
        <style>${style}</style>

        <div>
          <span></span>
        </div>
      </template>`;

  /** Создание компонента {MessageDocument} @constructor
    * @param {*} data содержимое элемента
    * @param {string?} time временная метка сообщения
    */
    constructor(data, time) {
      super();
      this.time = time;
      this.store(data);
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessageDocument} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      const data = this.store();

      const div = $('div', node);
      const f = {} // new UiFile({file: data, message: true});
      div.append(f);
      const span = document.createElement('span');
      span.innerText = this.time;
      div.append(span);

      return this;
    }

  /**
   *
   * @param {*} data
   * @param {string} time
   */
    static from(data, time) {
      const content = new MessageDocument(data, time);
      return content;
    }
  }

Component.init(MessageDocument, 'message-document', {attributes, properties});
