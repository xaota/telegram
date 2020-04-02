import telegram, {storage} from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import {loadDialogs} from '../../../state/dialogs/index.js';


/* eslint-disable */
import UIFAB         from '../../ui/fab/ui-fab.js';
import UIDrop        from '../../ui/drop/ui-drop.js';
import UIList        from '../../ui/list/ui-list.js';
import ChatItem      from '../../app/chat-item/chat-item.js';
import UINetwork     from '../../ui/network/ui-network.js';
import ChatsHeader   from '../../app/chats-header/chats-header.js';
import LayoutLoading from '../loading/layout-loading.js';
/* eslint-enable */

const {construct, isObjectOf, CONSTRUCTOR_KEY} = zagram;
const component = Component.meta(import.meta.url, 'layout-chats');
const attributes = {};
const properties = {};

export default class LayoutChats extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const list = $('ui-list', node);
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
    return this;
  }
}

Component.init(LayoutChats, component, {attributes, properties});

/** */
  async function createChatsList(list, loading, {lists, type}) { // chats
    const me = storage.get('me');

    const root = document.createDocumentFragment();
    const dialogs = await getDialogs();

    for (let i = 0; i < dialogs.length; ++i) {
      const model = dialogs[i];
      const item  = await ChatItem.from({model, me}); // eslint-disable-line
      root.append(item);
    }

    list.innerHTML = '';
    list.store({list: type}); // .setAttribute('list', type);
    list.append(root);
    loading.style.display = 'none';
  }

/**
 * Builds map for fast user access by id
 * @param {Array<*>} users
 * @returns {Map<Number, *>}
 */
function buildUserMap(users) {
  const usersMap = new Map();
  users.forEach(x => usersMap.set(x.id, x));
  return usersMap;
}

/**
 * Builds map  for fast chat/channel access by id
 * @param chats
 * @returns {Map<any, any>}
 */
function buildChatMap(chats) {
  const chatMap = new Map();
  chats.forEach(x => chatMap.set(x.id, x));
  return chatMap;
}


/**
 * Checks that pears are equal for message and dialog
 * @param dialog
 * @param message
 */
function checkPeersAreEqual(dialog, message) {
  if (dialog.peer[CONSTRUCTOR_KEY] === message.to_id[CONSTRUCTOR_KEY]) {
    if (isObjectOf('peerUser', dialog.peer)) {
      return dialog.peer.user_id === message.to_id.user_id;
    }

    if (isObjectOf('peerChat', dialog.peer)) {
      return dialog.peer.chat_id === message.to_id.chat_id;
    }

    if (isObjectOf('peerChannel', dialog.peer)) {
      return dialog.peer.channel_id === message.to_id.channel_id;
    }
  }
  return false;
}

function buildDialogsList({dialogs, chats, users, messages}) {
  const chatMap = buildChatMap(chats);
  const userMap = buildUserMap(users);

  function attachInfo(dialog) {
    if (isObjectOf('peerUser', dialog.peer)) {
      dialog.user = userMap.get(dialog.peer.user_id);
      const {first_name: firstName, last_name: lastName} = dialog.user;
      dialog.title = `${firstName} ${lastName}`;
      dialog.id = dialog.user.id;
    }

    if (isObjectOf('peerChat', dialog.peer)) {
      dialog.chat = chatMap.get(dialog.peer.chat_id);
      dialog.title = dialog.chat.title;
      dialog.id = dialog.chat.id;
    }

    if (isObjectOf('peerChannel', dialog.peer)) {
      dialog.chat = chatMap.get(dialog.peer.channel_id);
      dialog.title = dialog.chat.title;
      dialog.id = dialog.chat.id;
    }

    const filteredMessages = messages.filter(x => checkPeersAreEqual(dialog, x));
    if (filteredMessages.length > 0) {
      dialog.last_message = filteredMessages[0];
    }

    return dialog;
  }

  return dialogs.map(attachInfo);
}

/** getDialogs @async
  * @param {string} [type="chatListMain"] one of 'chatListMain', 'chatListArchive'
  */
  async function getDialogs(offset_chat_id = 0, limit = 20) {
    try {
      const response = await telegram.api(
        'messages.getDialogs',
        {
          limit,
          offset_date: 0,
          offset_id: offset_chat_id,
          offset_peer: construct('inputPeerEmpty'),
          hash:  0
        }
      );

      return buildDialogsList(response);
    } catch (e) {
      console.warn(e);
      return [];
    }
  }
