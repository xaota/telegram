import telegram from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import {loadDialogs} from '../../../state/dialogs/index.js';
import {getDialogWithLastMessage} from '../../../state/dialogs/helpers.js';


/* eslint-disable */
import UIFAB         from '../../ui/fab/ui-fab.js';
import UIDrop        from '../../ui/drop/ui-drop.js';
import UIList        from '../../ui/list/ui-list.js';
import ChatItem      from '../../app/chat-item/chat-item.js';
import UINetwork     from '../../ui/network/ui-network.js';
import ChatsHeader   from '../../app/chats-header/chats-header.js';
import LayoutLoading from '../loading/layout-loading.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {map, distinctUntilChanged, withLatestFrom} = rxjs.operators;
const {construct, isObjectOf, CONSTRUCTOR_KEY} = zagram;
const component = Component.meta(import.meta.url, 'layout-chats');
const attributes = {};
const properties = {};


const getDialogsOrder = R.pathOr([], ['dialogs', 'dialogsOrder']);

const getInputPeer = R.cond([
  [R.equals(undefined), R.always(construct('inputPeerSelf'))],
  [isObjectOf('peerChat'), R.partial(construct, ['inputPeerChat'])],
  [isObjectOf('peerUser'), R.partial(construct, ['inputPeerUser'])],
  [isObjectOf('peerChannel'), R.partial(construct, ['inputPeerChannel'])],
  [R.T, R.always(construct('inputPeerSelf'))]
]);

export default class LayoutChats extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const list = $('ui-list', node);
    const layoutLoading = $('layout-loading', node);
    const loadMoreButton = $('#load-more', node);
    // const items = [...list.querySelectorAll('chat-item')];
    // items.forEach(item => item.addEventListener('click', e => channel.send('conversation.open', {id: item.dataset.id})));

    const fab =  $('ui-fab',  node);
    const drop = $('ui-drop', node);
    fab.addEventListener('click', _ => {
      const show = !drop.show;
      drop.show = show;
      fab.innerText = show ? 'close' : 'edit';
    });

    const newGroup = $('#fab-group', drop);
    newGroup.addEventListener('click', _ => {
      channel.send('route-aside', {route: 'form-group'});
      drop.show = false;
      fab.innerText = 'edit';
    });

    const newChannel = $('#fab-channel', drop);
    newChannel.addEventListener('click', _ => {
      channel.send('route-aside', {route: 'form-channel'});
      drop.show = false;
      fab.innerText = 'edit';
    });


    // const chats = {};
    const lists = {
      chatListMain:    new Set(),
      chatListArchive: new Set()
    };

    const type = 'chatListMain';

    list.store({list: type}); // .setAttribute('list', type);

    channel.on('chat.new', chat => {
      // if (!chats[chat.id]) chats[chat.id] = chat;
    });

    channel.on('list.chat', ({chat_id: chatId, chat_list: chatList}) => {
      lists[chatList].add(chatId);
    });

    loadDialogs(); // first time load dialogs on mount;
    const state$ = getState$();
    const dialogs$ = state$
      .pipe(map(getDialogsOrder));

    dialogs$.pipe(distinctUntilChanged()).subscribe(dialogOrderList => {
      console.log('[DIALOGS]:', dialogOrderList);
      createChatsList(list, layoutLoading, dialogOrderList);
    });

    const loadMoreButtonClick$ = fromEvent(loadMoreButton, 'click');
    const latestDialog$ = dialogs$.pipe(
      map(R.pipe(R.last, R.partialRight(R.append, [['dialogs', 'dialogs']]))),
      withLatestFrom(state$),
      map(R.apply(R.path))
    );

    const loadMore$ = loadMoreButtonClick$.pipe(
      withLatestFrom(latestDialog$),
      map(R.nth(1)),
      map(getDialogWithLastMessage)
    );

    loadMore$.subscribe(x => {
      console.log('[LAST DIALOG]:', x);
      loadDialogs({
        offset_id: R.propOr(0, 'top_message', x),
        offset_date: R.pathOr(0, ['last_message', 'date'], x),
        offset_peer: getInputPeer()
      });
    });

    return this;
  }
}

Component.init(LayoutChats, component, {attributes, properties});

/** */
  async function createChatsList(list, loading, dialogs) { // chats
    const root = document.createDocumentFragment();

    for (let i = 0; i < dialogs.length; ++i) {
      const item  = await ChatItem.from(dialogs[i]); // eslint-disable-line
      root.append(item);
    }

    list.innerHTML = '';
    list.append(root);
    if (dialogs.length > 0) {
      loading.style.display = 'none';
    }
  }

