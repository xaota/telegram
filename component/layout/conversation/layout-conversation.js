import Component from '../../../script/Component.js';

import $, {updateChildrenElement} from '../../../script/DOM.js';
import File from '../../../script/File.js';
import telegram from '../../../tdweb/Telegram.js';

import UIList             from '../../ui/list/ui-list.js';
import UIAvatar           from '../../ui/avatar/ui-avatar.js';
import AppMessage         from '../../app/message/app-message.js';
import LayoutLoading      from '../loading/layout-loading.js';
import ConversationInput  from '../../app/conversation-input/conversation-input.js';
import ConversationHeader from '../../app/conversation-header/conversation-header.js';

import MessageText  from '../../message/text/message-text.js';
import MessageSticker from '../../message/sticker/message-sticker.js';

import '../sidebar/layout-sidebar.js';
import '../../ui/tabs/ui-tabs.js';
import '../../ui/tab/ui-tab.js';

import '../../ui/icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'layout-conversation');
const attributes = {

  }

const properties = {

  }

export default class LayoutConversation extends Component {
  constructor(data) {
    super(component);
    this.store(data);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const aside = $('aside', node);
    const sidebar = $('layout-sidebar', node)
    $('conversation-header', node)
        .addEventListener('open-profile', e => {
          aside.style.display = 'flex';
        });
    $('conversation-header', node)
        .addEventListener('open-search', e => {
          aside.style.display = 'flex';
        });
    sidebar
        .addEventListener('close-sidebar', e => {
          aside.style.display = 'none';
        });

    const {chat, me} = this.store();
    $('conversation-input', node).setAttribute('chat', chat);
    getHistory(chat, me, $('ui-list', node));
    return this;
  }
}

Component.init(LayoutConversation, component, {attributes, properties});

async function getHistory(chat, me, list, loading) {
  const root = document.createDocumentFragment();
  const chat_id = chat.id;
  const from_message_id = chat.last_message.id;
  const last = await getChatHistory(chat_id); // from_message_id
  const prev = await getChatHistory(chat_id, from_message_id);
  const messages = [...last.messages, ...prev.messages];
  const members = await getUsers([...new Set(messages.map(m => m.sender_user_id))]);
  messages.forEach(m => m.author = members[m.sender_user_id]);
  messages.reverse().forEach(m => createMessageItem(m, root));
  list.innerHTML = '';
  list.append(root);
    // loading.style.display = 'none';
}

/** */
  function createMessageItem(message, node) {
    const sender = message.author
      ? message.author.first_name + ' ' + message.author.last_name
      : '';

    const item = new AppMessage();
    if (sender) item.setAttribute(message.is_outgoing ? 'right' : 'left', '');


    if (message.content['@type'] === 'messageSticker') {
      const uiSticker = new MessageSticker(message.content.sticker);
      item.append(uiSticker);
      return node.append(item);
    }

    let avatar;
    if (sender) {
      avatar = new UIAvatar();
      avatar.innerHTML = UIAvatar.letter(sender);
      avatar.color = UIAvatar.color();
      avatar.setAttribute('slot', 'avatar');
      item.append(avatar);

      const d = message.author && message.author.profile_photo && message.author.profile_photo.small;
      if (d) File.getFile(d).then(src => avatar.src = src); // не оч круто
    }

    const content = new MessageText();
    if (sender) {
      content.setAttribute(message.is_outgoing ? 'right' : 'left', '');
    }
    content.setAttribute('timestamp', AppMessage.timestamp(message.date));
    if (sender && avatar) content.setAttribute('color', avatar.color);
    const author = document.createElement('span');
    author.innerText = sender;
    author.slot = 'author';
    const span = document.createElement('span');
    span.innerText = message.content['@type'] === 'messageText'
      ? message.content.text.text
      : 'не поддерживается '+ message.content['@type'];
    span.slot = 'content';

    content.append(author);
    content.append(span);
    item.append(content);

    node.append(item);
  }

/** getUsers */
  async function getUsers(user_ids) {
    user_ids = user_ids
      .filter(e => e !== 0)
      .map(user_id => telegram.api('getUser', {user_id}));
    const data = await Promise.all(user_ids);
    const users = {};
    data.forEach(u => users[u.id] = u);
    return users;
  }

/** getChatHistory */
  async function getChatHistory(chat_id, from_message_id = 0, offset = 0, limit = 80) {
    const options = {chat_id, from_message_id, offset, limit, only_local: false};
    return telegram.api('getChatHistory', options);
  }

