import telegram, {storage} from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIFAB         from '../../ui/fab/ui-fab.js';
import UIDrop        from '../../ui/drop/ui-drop.js';
import UIList        from '../../ui/list/ui-list.js';
import UIAvatar      from '../../ui/avatar/ui-avatar.js';
import ChatItem      from '../../app/chat-item/chat-item.js';
import ChatsHeader   from '../../app/chats-header/chats-header.js';
import LayoutLoading from '../loading/layout-loading.js';

const component = Component.meta(import.meta.url, 'layout-chats');
const attributes = {

  }

const properties = {

  }

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

function createDialogItem(d, node) {
  const avatar = new UIAvatar();
  avatar.innerHTML = UIAvatar.letter(d.title);
  avatar.color = UIAvatar.color();
  avatar.slot = 'avatar';

  const title = document.createElement('span');
  title.innerText = d.title;
  title.slot = 'title';

  // const author = document.createElement('span');
  // author.innerText = user.name;
  // author.slot = 'author';

  const last = document.createElement('span');
  last.innerText = getMessagePreview(d.last_message);
  last.slot = 'message';

  const item = new ChatItem();
  if (d.unread_count > 0) item.setAttribute('badge', d.unread_count);
  if (d.notification_settings.mute_for !== 0) item.setAttribute('muted', '');
  if (d.is_pinned) item.setAttribute('pin', '');

  item.append(avatar);
  item.append(title);
  // item.append(author);
  item.append(last);

  // item.dataset.id = d.id;
  item.addEventListener('click', e => channel.send('conversation.open', {chat: d.id, message: d.last_message.id}));
  node.append(item);
}

function getMessagePreview(message) {
  const type = message.content['@type'];
  const handlers = {
    messageText:      c => c.text.text,
    messagePoll:      c => '📊 Poll',
    messagePhoto:     c => '🖼 ' + (c.caption && c.caption.text || 'Photo'),
    messageVideo:     c => '🎥 ' + (c.caption && c.caption.text || 'Video'),
    messageAudio:     c => '🎵 ' + c.audio.title || 'Audio',
    messageSticker:   c => c.sticker.emoji + ' Sticker',
    messageDocument:  c => 'Document ' + c.document.file_name,
    messageAnimation: c => 'GIF',
    messageChatAddMembers:    c => 'добавление в чат',
    messageContactRegistered: c => 'теперь в телеграм',
  };
  const text = typeof handlers[type] === 'function'
    ? handlers[type](message.content)
    : 'неподдерживаемое сообщение (' + type + ')';
  return text.split(/\n/)[0];
}

/** */
  async function createChatsList(list, loading) {

      const me = await telegram.api('getMe');
      storage.set('user', me);

      // const id = me.profile_photo.id;
      // const remote_file_id = me.profile_photo.small.remote.id;
      // // const avatar = await telegram.api('getRemoteFile', {remote_file_id});
      // // downloadFile -> priority
      // const avatar = await telegram.api('downloadFile', {file_id: 1, priority: 1});

      // setTimeout(async () => {
      //   const response = await telegram.api('readFilePart', {file_id: 1});
      //   // console.log('FILE BLOB', response.data);
      //   var reader = new FileReader();
      //   reader.readAsDataURL(response.data);
      //   reader.onloadend = function() {
      //       var base64data = reader.result;
      //       // console.log('FILE BASE64', base64data);

      //       const img = new Image();
      //       img.src = base64data;
      //       list.append(img);
      //   }
      // }, 15000);

      // console.warn('avatar', avatar);
      // debugger;

    // try {
      const root = document.createDocumentFragment();
      const dialogs = await getDialogs();
      dialogs.forEach(d => createDialogItem(d, root));
      list.innerHTML = '';
      list.append(root);
      loading.style.display = 'none';
    // } catch (e) {

    // }

    // setTimeout(() => createChatsList(list, loading, timeout), timeout);
  }

  // _: "user"
  // flags: 1107
  // self: true
  // id: 170106
  // access_hash: "16859688971042092518"
  // first_name: "xaota"
  // phone: "79610433909"
  // status: {_: "userStatusOffline", was_online: 1581337382}

//   _: "dialog"
// flags: 0
// peer:
// _: "peerUser"
// user_id: 777000

// top_message: 45
// read_inbox_max_id: 0
// read_outbox_max_id: 0
// unread_count: 45
// notify_settings:
  // _: "peerNotifySettings"
  // flags: 1
  // show_previews: true
  // mute_until: 0
  // sound: "default"

/** getDialogs */
  async function getDialogs(offset_date = 0, limit = 20) {
    // const temp = await telegram.api('messages.getDialogs', {offset_date, limit}); // e.code === 401 -> show login
    const {chat_ids} = await telegram.api('getChats', {offset_order: '9223372036854775807', offset_chat_id: 0, limit});
    return Promise.all(chat_ids.map(chat_id => telegram.api('getChat', {chat_id})));
  }
