import Component from '../../../script/Component.js';
import telegram from '../../../tdweb/Telegram.js';
import $, {channel, updateChildrenHTML, updateChildrenText} from '../../../script/DOM.js';
import {dateDay, formatDate} from '../../../script/helpers.js';

/* eslint-disable */
import UIIcon     from '../../ui/icon/ui-icon.js';
import UIBadge    from '../../ui/badge/ui-badge.js';
import UIAvatar   from '../../ui/avatar/ui-avatar.js';
import AppMessage from '../message/app-message.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'chat-item');
const attributes = {
    badge(root, value) { updateChildrenHTML(root, 'ui-badge', value); },
    status(root, value) { updateChildrenText(root, '#status', value); },
    timestamp(root, value) { updateChildrenHTML(root, 'div.dialog__date > span.timestamp', value); }
  };

const properties = {

  };

export default class ChatItem extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const {me, peer, id} = this.store();

    const slotAvatar = $('slot[name="avatar"]', node);
    const avatar = [...slotAvatar.assignedNodes()].find(e => UIAvatar.is(e));

    if (peer) {
      channel.on('user.status', e => {
        if (e.user_id !== peer) return;
        avatar.online = e.online;
      });
    }

    channel.on('chat.message', async ({chat_id: chatId, last_message: lastMessage}) => {
      if (chatId !== id) return;
      lastMessage(this, lastMessage);
      await lastAuthor(this, {me: me.id, peer, sender: lastMessage.sender_user_id});
    });

    channel.on('chat.counter', ({chat_id: chatId, unread_count: unreadCount}) => {
      if (chatId !== id) return;
      this.setAttribute('badge', unreadCount);
      // !
    });

    return this;
  }

  static from({model, user, me}) {
    console.log(model);
    const avatar     = new UIAvatar();
    avatar.innerHTML = UIAvatar.letter(model.title);
    avatar.color     = UIAvatar.color(model.id);
    avatar.slot      = 'avatar';
    // if (model.photo && model.photo.small) File.getFile(model.photo.small).then(src => avatar.src = src);

    const title     = document.createElement('span');
    title.innerText = model.title;
    title.slot      = 'title';

    const item = new ChatItem();
    item.dataset.id = model.id;
    item.store({id: model.id, me});

    if (model.unread_count > 0) item.setAttribute('badge', model.unread_count); //

    if (model.notify_settings.mute_until !== 0) item.setAttribute('muted', '');
    if (model.pinned) item.setAttribute('pin', '');
    //
    item.append(avatar);
    item.append(title);

    // chatTypeBasicGroup, chatTypePrivate, , and chatTypeSupergroup.
    // ! chatTypeSecret
    // const type = model.type['@type'];
    // const types = {
    //   chatTypeBasicGroup: () => telegram.api('getBasicGroup', {basic_group_id: model.type.basic_group_id}),
    //   chatTypeSupergroup: () => telegram.api('getSupergroup', {supergroup_id: model.type.supergroup_id}),
    //   chatTypePrivate:    () => telegram.api('getUser', {user_id: model.type.user_id})
    // };
    // if (type in types) {
    //   const {is_verified} = await types[type]();
    //   if (is_verified) {
    //     const verify = new UIIcon('verify');
    //     verify.slot = 'title';
    //     item.append(verify);
    //   };
    //
    //   if (type === 'chatTypePrivate') { // || type === 'chatTypeSecret'
    //     const peer = await telegram.api('getUser', {user_id: model.id})
    //     avatar.online = peer.status['@type'] === 'userStatusOnline';
    //     item.store({peer: peer.id});
    //   }
    // }

    if (model.last_message) last(item, model.last_message, model, me);
    // item.addEventListener('click', e => channel.send('conversation.open', {chat_id: model.id})); // todo: #110

    return item;
  }
}

Component.init(ChatItem, component, {attributes, properties});

/** */
  function last(root, message, model, me) {
    const current = formatDate(dateDay(), true);
    const updated = formatDate(dateDay(message.date * 1000), true);
    const timestamp = current === updated ? AppMessage.timestamp(message.date) : updated;
    root.setAttribute('timestamp', timestamp);

    // if (message.is_outgoing) {
    //   root.status = (model.type.is_channel && model.last_read_inbox_message_id === message.id) || (!model.type.is_channel && model.last_read_outbox_message_id === message.id)
    //     ? 'receive' : 'sent';
    // }
    lastMessage(root, message, true);
    // await lastAuthor(root, {me: me.id, peer: model.type.user_id, sender: message.sender_user_id});
  }

/** lastAuthor */
  async function lastAuthor(root, {me, peer, sender}) {
    if (sender === 0 || sender === me.id || peer === sender) return;
    const user = await telegram.api('getUser', {user_id: sender});

    const author = document.createElement('span');
    author.innerText = (user.first_name + ' ' + user.last_name).trim();
    author.slot = 'author';

    const authorSlot = $('slot[name="author"]', root.shadowRoot);
    if (authorSlot) [...authorSlot.assignedNodes()].forEach(e => e.remove());

    root.append(author);
  }

/** lastMessage */
  function lastMessage(root, message) {
    const element     = document.createElement('span');
    element.innerText = AppMessage.preview(message);
    element.slot      = 'message';

    const slotMessage = $('slot[name="message"]', root.shadowRoot);
    if (slotMessage) [...slotMessage.assignedNodes()].forEach(e => e.remove());

    root.append(element);
    root.store({point: message.id});
  }
