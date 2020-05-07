import Component, {html, css} from '../../script/ui/Component.js';
import {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';

import MessagePhoto from './photo.js';

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

  :host([left]:first-child) div::after, :host([left]:last-child) div::before,
  :host([right]:first-child) div::after, :host([right]:last-child) div::before {
    position: absolute;
    width: 12px;
    left: 0;
    transform: translateX(calc(-100% + 2px));
    bottom: 0;
    content: "";
  }

  :host([left]:first-child) div::before,
  :host([right]:first-child) div::before { /* тень хвостика (только вниз пусть будет) */
    height: 1px; /* 0 */
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
  }

  :host([left]:first-child) div::after,
  :host([right]:first-child) div::after { /* хвостик */
    height: 24px;
    background: radial-gradient(ellipse farthest-side at top left, transparent 100%, var(--background-message-in) 100%);
  }

  :host([right]:first-child) div::before,
  :host([right]:first-child) div::after {
    right: 0;
    transform: translateX(calc(100% - 2px));
    left: inherit;
  }

  :host([right]:first-child) div::after {
    background: radial-gradient(ellipse farthest-side at top right, transparent 100%, var(--background-message-out) 100%);
  }

  :host([reply]) div::before,
  :host([reply]) div::after {
    display: none;
  }

  /* ----------------- */

  :host([reply]) div {
    border-radius: 0;
    box-shadow: none;
    display: block;
    max-width: 100%;
    background: transparent;
    padding-left: 3px;
    position: static;
  }


  slot[name="web-page"] {
    cursor: pointer;
    border-left: 2px solid #4ea4f5;
    display: flex;
    margin-top: 5px;
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
    right: 4px;
    bottom: 1px;
  }

  :host([reply]) span {
    display: none;
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

/** {MessageText} @class
  * @description Отображение сообщения-текста
  */
  export default class MessageText extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <div> <!-- main -->
          <slot name="author"></slot>
          <slot name="content"></slot>
          <span></span> <!-- timestamp -->
          <slot name="web-page"></slot>
        </div>
      </template>`;

  // /** Создание компонента {MessageText} @constructor
  //   // * @param {string?} text содержимое элемента
  //   */
  //   constructor() { // text
  //     super();
  //     // if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessageText} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }

  /** */
    webpage(webPage) {
      const web = document.createElement('div');
      // web.setAttribute('class', 'web');
      web.slot = 'web-page';
      web.addEventListener('click', () => {
        window.open(webPage.url,'_blank');
      });

      if (webPage.photo) {
        const img = document.createElement('img');
        MessagePhoto.src(webPage.photo).then(url => img.src = url);
        web.append(img);
      }

      if (webPage.site_name) {
        const name = document.createElement('span');
        name.innerText = webPage.site_name;
        name.setAttribute('class', 'name');
        web.append(name);
      }


      if (webPage.title) {
        const title = document.createElement('span');
        title.innerText = webPage.title;
        title.setAttribute('class', 'title');
        web.append(title);
      }

      if (webPage.description) {
        const descr = document.createElement('span');
        descr.innerText = webPage.description;
        descr.setAttribute('class', 'descr');
        web.append(descr);
      }

      this.append(web);

      // content.replace(
      //     /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g, // eslint-disable-line
      //     '<a href="$1">$1</a>'
      // );
    }
  }

Component.init(MessageText, 'message-text', {attributes, properties});
