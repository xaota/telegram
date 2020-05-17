import Component, {html, css} from '../../script/ui/Component.js';
import $, {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';

import {getTimestamp, downloadFile$, createUrl} from '../../script/helpers.js';
import {buildThumbnailFileLocation} from '../../script/utils/message.js';

const {of} = rxjs;
const {map, switchMap} = rxjs.operators;

const style = css`
  :host {
    display: block;
    font-size: 14px;
    --color: var(--foreground-label);
  }

  :host([reply]) {
    font-size: 13px;
  }

  .main {
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

  :host([left]) .main {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background: var(--background-message-in);
  }

  :host([right]) .main {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    background: var(--background-message-out);
  }

  /* хвостик */
  :host([left]:last-child) .main {
    border-bottom-left-radius: 0;
  }

  :host([right]:last-child) .main {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 5px;
  }

  :host([left]:first-child) .main::after, :host([left]:last-child) .main::before,
  :host([right]:first-child) .main::after, :host([right]:last-child) .main::before {
    position: absolute;
    width: 12px;
    left: 0;
    transform: translateX(calc(-100% + 2px));
    bottom: 0;
    content: "";
  }

  :host([left]:first-child) .main::before,
  :host([right]:first-child) .main::before { /* тень хвостика (только вниз пусть будет) */
    height: 1px; /* 0 */
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
  }

  :host([left]:first-child) .main::after,
  :host([right]:first-child) .main::after { /* хвостик */
    height: 24px;
    background: radial-gradient(ellipse farthest-side at top left, transparent 100%, var(--background-message-in) 100%);
  }

  :host([right]:first-child) .main::before,
  :host([right]:first-child) .main::after {
    right: 0;
    transform: translateX(calc(100% - 2px));
    left: inherit;
  }

  :host([right]:first-child) .main::after {
    background: radial-gradient(ellipse farthest-side at top right, transparent 100%, var(--background-message-out) 100%);
  }

  :host([reply]) .main::before,
  :host([reply]) .main::after {
    display: none;
  }

  /* ----------------- */

  :host([reply]) .div {
    border-radius: 0;
    box-shadow: none;
    display: block;
    max-width: 100%;
    background: transparent;
    padding-left: 3px;
    position: static;
  }


  div.web-page {
    cursor: pointer;
    border-left: 2px solid #4ea4f5;
    display: flex;
    flex-direction: column;
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
  
  slot[name="web-page"] {
    width: 100%;
  }
  
  :host([reply]) .content {
    color: #707579;
  }

  .content:after {
    content: "";
    display: inline-block;
    width: 1.8rem;
  }

  .timestamp { /* timestamp */
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
  }
  `;

const attributes = {
  color(root, value) { cssVariable(this, 'color', value); },
  timestamp(root, value) { updateChildrenText(root, '.timestamp', value); }
  // status=received, sended
  // views
  // sign (author)
};
const properties = {
  // edited
};

/** {MessageWebPage} @class
 * @description Отображение сообщения-текста
 */
export default class MessageWebPage extends Component {
  static template = html`
      <template>
        <style>${style}</style>
        <div class="main"> <!-- main -->
          <div class="content"></div> 
          <div class="webpage-place">
          
          </div>
          <span class="timestamp"></span> <!-- timestamp -->
        </div>
      </template>`;

  constructor(message) {
    super();
    this.store({message});
  }

  // /** Создание компонента {MessageWebPage} @constructor
  //   // * @param {string?} text содержимое элемента
  //   */
  //   constructor() { // text
  //     super();
  //     // if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
   * @param {ShadowRoot} node корневой узел элемента
   * @return {Component} @this {MessageWebPage} текущий компонент
   */
  mount(node) {
    super.mount(node, attributes, properties);
    const {message} = this.store();

    const contentNode = $('.content', node);
    contentNode.innerText = message.message;


    const webPage = R.path(['media', 'webpage'], message);
    const web = document.createElement('div');
    web.classList.add('web-page');
    web.style.width = '400px';
    // web.setAttribute('class', 'web');
    web.slot = 'web-page';
    web.addEventListener('click', () => {
      window.open(webPage.url,'_blank');
    });

    if (webPage.photo) {
      const fileUrl$ = of(message)
        .pipe(
          map(buildThumbnailFileLocation),
          switchMap(downloadFile$),
          map(createUrl)
        );

      fileUrl$.subscribe(fileUrl => {
        const img = document.createElement('img');
        img.src = fileUrl;
        web.append(img);
      });
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

    const webPageNode = $('.webpage-place', node);
    console.log('Web Page Node:', webPageNode);
    webPageNode.appendChild(web);

    const timestamp = getTimestamp(message.date);
    const timestampNode = $('.timestamp', node);
    timestampNode.innerText = timestamp;

    return this;
  }
}

Component.init(MessageWebPage, 'message-web-page', {attributes, properties});
