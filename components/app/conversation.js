import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {peerIdToPeer} from '../../state/utils.js';
import {getDialogWithLastMessage} from '../../state/dialogs/helpers.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';

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

const {combineLatest, fromEvent} = rxjs;
const {map, distinctUntilChanged} = rxjs.operators;
const {isObjectOf} = zagram;

const buildUserByIdSelector = R.pipe(
  R.prop('user_id'),
  R.partialRight(R.append, [['users']]),
  R.path
);


const buildChatByIdSelector = R.pipe(
  R.prop('chat_id'),
  R.partialRight(R.append, [['chats']]),
  R.path
);

const buildChannelByIdSelector = R.pipe(
  R.prop('channel_id'),
  R.partialRight(R.append, [['chats']]),
  R.path
);

const getPeerInfoSelectorByPeerId = R.pipe(
  peerIdToPeer,
  R.cond([
    [isObjectOf('peerUser'), buildUserByIdSelector],
    [isObjectOf('peerChat'), buildChatByIdSelector],
    [R.T, buildChannelByIdSelector]
  ])
);

const getDialogTitle = R.pipe(
  R.prop('peer_info'),
  R.cond([
    [R.equals(undefined), R.always('dialog')],
    [isObjectOf('user'), R.prop('first_name')],
    [isObjectOf('chat'), R.prop('title')],
    [isObjectOf('channel'), R.prop('title')],
    [R.T, R.always('dialog')]
  ])
);

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
          <p>Яндекс.Диалоги (сообщество разработчиков)</p>
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
    const dialog$ = state$.pipe(
      map(R.path(['dialogs', 'dialogs', dialogId])),
      map(getDialogWithLastMessage),
      distinctUntilChanged()
    );

    const peerInfo$ = state$.pipe(
      map(getPeerInfoSelectorByPeerId(dialogId)),
      map(wrapAsObjWithKey('peer_info'))
    );

    const dialogInfo$ = combineLatest(dialog$, peerInfo$).pipe(map(R.mergeAll));
    dialogInfo$.subscribe(dialog => {
      this.store({dialog});
    });

      return this;
    }

  /** */
    render(node) {
      const {dialog} = this.store(); // id диалога, string
      if (!dialog) return this;
      console.log('[AppConversation]', dialog);

      return this;
    }
  }

Component.init(AppConversation, 'app-conversation', {attributes, properties});
