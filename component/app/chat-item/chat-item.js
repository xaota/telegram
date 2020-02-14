import Component from '../../../script/Component.js';

import $, {channel, updateChildrenHTML, updateChildrenText} from '../../../script/DOM.js';
import File       from '../../../script/File.js';

import UIIcon     from '../../ui/icon/ui-icon.js';
import UIBadge    from '../../ui/badge/ui-badge.js';
import UIAvatar   from '../../ui/avatar/ui-avatar.js';
import AppMessage from '../message/app-message.js';

const component = Component.meta(import.meta.url, 'chat-item');
const attributes = {
    badge(root, value) { updateChildrenHTML(root, 'ui-badge', value) },
    status(root, value) { updateChildrenText(root, '#status', value) },
    timestamp(root, value) { updateChildrenHTML(root, 'div.dialog__date > span.timestamp', value) }
  }

const properties = {

  }

export default class ChatItem extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }

  static async from({model, user, me}) {
    const avatar     = new UIAvatar();
    avatar.innerHTML = UIAvatar.letter(model.title);
    avatar.color     = UIAvatar.color(model.type.supergroup_id || model.id);
    avatar.slot      = 'avatar';
    if (model.photo && model.photo.small) File.getFile(model.photo.small).then(src => avatar.src = src);

    const title     = document.createElement('span');
    title.innerText = model.title;
    title.slot      = 'title';

    const last     = document.createElement('span');
    last.innerText = AppMessage.preview(model.last_message);
    last.slot      = 'message';

    const item = new ChatItem();
    if (model.unread_count > 0) item.setAttribute('badge', model.unread_count);
    if (model.notification_settings.mute_for !== 0) item.setAttribute('muted', '');
    if (model.is_pinned) item.setAttribute('pin', '');
    item.setAttribute('timestamp', AppMessage.timestamp(model.last_message.date));
    if (model.last_message.is_outgoing) item.status = (model.type.is_channel && model.last_read_inbox_message_id === model.last_message.id) || (!model.type.is_channel && model.last_read_outbox_message_id === model.last_message.id) ? 'receive' : 'sent';

    item.append(avatar);
    item.append(title);
    item.append(last);

    // chatTypeBasicGroup, chatTypePrivate, , and chatTypeSupergroup.
    // ! chatTypeSecret
    const type = model.type['@type'];
    const types = {
      chatTypeBasicGroup: () => telegram.api('getBasicGroup', {basic_group_id: model.type.basic_group_id}),
      chatTypeSupergroup: () => telegram.api('getSupergroup', {supergroup_id: model.type.supergroup_id}),
      chatTypePrivate:    () => telegram.api('getUser', {user_id: model.type.user_id})
    };
    if (type in types) {
      const {is_verified} = await types[type]();
      if (is_verified) title.append(new UIIcon('verify'));

      if (type === 'chatTypePrivate') { // || type === 'chatTypeSecret'
        const peer = await telegram.api('getUser', {user_id: model.id})
        if (peer.status['@type'] === 'userStatusOnline') avatar.setAttribute('online', '');
      }
    }
    // console.log('USER VERIFY INFO', model, user);
    // if (user.is_verified) author.appendChild(new UIIcon('verify'));

    if (user && model.type.user_id !== user.id) {
      const author = document.createElement('span');
      author.innerText = (user.first_name + ' ' + user.last_name).trim();
      author.slot = 'author';
      item.append(author);
    }

    item.dataset.id = model.id;
    item.addEventListener('click', e => channel.send('conversation.open', {chat: model, me}));

    return item;
  }

  static async fromId(chat_id, me) {
    const model = await telegram.api('getChat', {chat_id});
    const user_id = model.last_message.sender_user_id;
    let user;
    if (user_id !== 0 && user_id !== me.id) user = await telegram.api('getUser', {user_id})
    return ChatItem.from({model, user, me});
  }
}

Component.init(ChatItem, component, {attributes, properties});
