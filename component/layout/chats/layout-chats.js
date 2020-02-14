import telegram, {storage} from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIFAB         from '../../ui/fab/ui-fab.js';
import UIDrop        from '../../ui/drop/ui-drop.js';
import UIList        from '../../ui/list/ui-list.js';
import ChatItem      from '../../app/chat-item/chat-item.js';
import UINetwork     from '../../ui/network/ui-network.js';
import ChatsHeader   from '../../app/chats-header/chats-header.js';
import LayoutLoading from '../loading/layout-loading.js';

const component = Component.meta(import.meta.url, 'layout-chats');
const attributes = {}
const properties = {}

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


    createChatsList(list, $('layout-loading', node));
    return this;
  }
}

Component.init(LayoutChats, component, {attributes, properties});

/** */
  async function createChatsList(list, loading) {
      const me = await telegram.api('getMe');
      // storage.set('user', me);

      const root = document.createDocumentFragment();
      const {chat_ids} = await getDialogs();
      for (const id of chat_ids) {
        const item = await ChatItem.fromId(id, me);
        root.append(item);
      }

      list.innerHTML = '';
      list.append(root);
      loading.style.display = 'none';
  }

/** getDialogs @async */
  function getDialogs(offset_chat_id = 0, limit = 20) {
    const options = {offset_order: '9223372036854775807', offset_chat_id, limit};
    return telegram.api('getChats', options);
  }
