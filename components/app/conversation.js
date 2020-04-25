import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
/* eslint-disable */
import UIIcon from '../ui/icon.js'
import UIAvatar from '../ui/avatar.js'
import AppMessage from '../app/message.js'
import {getDialogTitle, previewMessage} from '../../state/dialogs/helpers.js'
import {dateDay, formatDate} from '../../script/helpers.js'
import {setActiveDialog} from '../../state/dialogs/actions.js'
import {getDialogWithLastMessage$} from '../../state/dialogs/stream-builders.js'
import {getUserFullName} from '../../state/users/utils.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {mapTo} = rxjs.operators;


const style = css`
  :host {
    display: grid;
    cursor: pointer;
    margin: 0 8px 2px;
    border-radius: 8px;
    padding: 8px;
    transition: background-color .2s ease;
    box-sizing: border-box;
    grid-template-areas:
        'avatar header'
        'avatar content';
    grid-template-columns: calc(3.6rem + 8px) auto;
    grid-template-rows: 1.8rem 1.8rem;
  }

  :host(:hover) {
    background-color: var(--background-aside-hover);
  }

  ui-avatar {
    width: 3.6rem;
    height: 3.6rem;
    grid-area: avatar;
    margin-right: 8px;
  }

  header, main {
    display: grid;
    align-items: center;
  }

  header > p, main > p {
    margin: 0;
    white-space: nowrap;
  }

  header {
    grid-area: header;
    grid-template-areas: 'caption last timestamp';
    grid-template-columns: auto fit-content(0) fit-content(0);
  }

  header > p {
    color: var(--foreground);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    grid-area: caption;
  }

  header > p > ui-icon { /* verify */
    margin-left: 4px;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    color: var(--iconHover);
  }

  header > p + ui-icon { /* sended, received */
    grid-area: last;
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  header > span {
    grid-area: timestamp;
    font-size: .8rem;
    font-weight: 300;
    color: #5f6369;
    white-space: nowrap;
  }

  main {
    grid-area: content;
    grid-template-areas: 'author preview badge';
    grid-template-columns: fit-content(0) auto fit-content(0);
  }

  main > p {
    font-weight: 400;
    color: var(--foreground-accent);
    margin-right: 4px;
  }
  main > p:after {
    content: '';
  }
  
  main > p.with-author:after {
    content: ':';
  }

  main > span {
    display: block;
    color: #707579;
    font-weight: 300;
    /* word-break: break-word; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }`;

const attributes = {};
const properties = {};


const getIdFromPeer = R.pipe(
  R.prop('peer_info'),
  R.cond([
    [R.equals(undefined), R.always(0)],
    [R.T, R.prop('id')]
  ])
);


/** {AppConversation} @class
  * @description Отображение чата в списке чатов
  */
  export default class AppConversation extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-avatar></ui-avatar>
        <header>
          <p><!-- chaption --></p>
          <ui-icon>receive</ui-icon>
          <span>Mar 1</span>
        </header>
        <main>
          <p>Daria Dugina</p>
          <span>🖼 По данным Variety, в сериале-приквеле «Изгоя-один» снимутся Кайл Соллер («Полдарк») и Стеллан Скарсгард, известный по «Чернобылю» и фильмам Ларса фон Триера.</span>
          <ui-badge>36</ui-badge>
        </main>
      </template>`;

  /** Создание компонента {AppConversation} @constructor
    * @param {string} dialogId - id of dialog in state
    */
    constructor(dialogId) {
      super();
      this.store({dialogId});
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {AppConversation} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const {dialogId} = this.store(); // id диалога, string

      const state$ = getState$();
      getDialogWithLastMessage$(state$, dialogId).subscribe(dialog => {
        this.store({dialog});
      });

      const selectDialog$ = fromEvent(node, 'click').pipe(mapTo(dialogId));

      selectDialog$.subscribe(setActiveDialog);
      return this;
    }

  /** / render */
    render(node) {
      const {dialog} = this.store(); // id диалога, string
      if (!dialog) return this;

      const current = formatDate(dateDay(), true);

      const peer     = getIdFromPeer(dialog);
      const verify   = R.pathOr(false, ['peer_info', 'verified'], dialog);
      const chaption = getDialogTitle(dialog);
      const lastMessageDate = R.pathOr(0, ['last_message', 'date'], dialog);
      const updated  = formatDate(dateDay(1000 * lastMessageDate), true);
      const timestamp = current === updated ? AppMessage.timestamp(lastMessageDate) : updated;

      // pinned, muted


      // nodes
      const avatarNode    = $('ui-avatar',        node);
      const chaptionNode  = $('header > p',       node);
      // const receiveNode   = $('header > ui-icon', node);
      const timestampNode = $('header > span',    node);
      const authorNode    = $('main > p',         node);
      const messageNode   = $('main > span',      node);
      const badgeNode     = $('main > ui-badge',  node);

      // patch ui
      this.dataset.peer = peer;
      avatarNode.color = UIAvatar.color(peer);
      avatarNode.innerText = UIAvatar.letter(chaption);
      chaptionNode.innerText = chaption;
      if (verify) chaptionNode.append(new UIIcon('verify'));
      timestampNode.innerText = timestamp;
      badgeNode.innerText = dialog.unread_count;
      const fullName = getUserFullName(R.pathOr({}, ['last_message', 'author'], dialog));
      if (fullName) {
        authorNode.innerText = fullName;
        authorNode.classList.add('withAuthor');
        authorNode.style.display = '';
      } else {
        authorNode.innerText = '';
        authorNode.classList.remove('withAuthor');
      }
      messageNode.innerText = previewMessage(R.propOr({}, 'last_message', dialog));

      // console.log('[app-conversation]', dialog);
      return this;
    }
  }

Component.init(AppConversation, 'app-conversation', {attributes, properties});
