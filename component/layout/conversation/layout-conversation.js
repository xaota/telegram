import Component from '../../../script/Component.js';

import $, {updateChildrenElement} from '../../../script/DOM.js';
import File from '../../../script/File.js';
import telegram from '../../../tdweb/Telegram.js';
import {formatDate, dateDay} from '../../../script/helpers.js';

import UIFAB              from '../../ui/fab/ui-fab.js';
import UIList             from '../../ui/list/ui-list.js';
import UIAvatar           from '../../ui/avatar/ui-avatar.js';
import AppMessage         from '../../app/message/app-message.js';
import LayoutLoading      from '../loading/layout-loading.js';
import ConversationInput  from '../../app/conversation-input/conversation-input.js';
import ConversationHeader from '../../app/conversation-header/conversation-header.js';

import MessageText    from '../../message/text/message-text.js';
import MessageEmoji   from '../../message/emoji/message-emoji.js';
import MessageSticker from '../../message/sticker/message-sticker.js';

import '../sidebar/layout-sidebar.js';
import '../../ui/tabs/ui-tabs.js';
import '../../ui/tab/ui-tab.js';
import '../../ui/list/ui-list.js';

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
    const list = $('ui-list', node);
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

    $('ui-fab', node).addEventListener('click', _ => {
      if (list.firstElementChild) list.firstElementChild.scrollIntoView({block: 'end', behavior: 'smooth'});
    });

    const {chat, me} = this.store();
    if (chat.type.is_channel) {
      $('conversation-input', node).style.display = 'none';
    } else {
      $('conversation-input', node).setAttribute('chat', chat.id);
    }
    $('conversation-header', node).setAttribute('chat', chat.id);
    getHistory(chat, me, list);
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

  insertDates(messages);
  messages.forEach(m => createMessageItem(m, root));
  list.innerHTML = '';
  list.append(root);
    // loading.style.display = 'none';
}

/** */
  function insertDates(messages) {
    let current = dateDay(messages[0].date * 1000);
    let message = formatDate(current, true);
    for (let i = 1; i < messages.length; ++i) {
      const day  = dateDay(messages[i].date * 1000);
      const temp = formatDate(day, true);
      if (temp !== message) {
        messages.splice(i, 0, {content: {'@type': 'messageText', text: {text: message}}});

        message = temp;
        current = day;
        ++i;
      }
    }
    messages.push({content: {'@type': 'messageText', text: {text: message}}});
  }

/** */
  function createMessageItem(message, node) {
    const sender = message.author
      ? message.author.first_name + ' ' + message.author.last_name
      : '';

    const timestamp = AppMessage.timestamp(message.date);

    const item = new AppMessage();
    let color;
    if (sender) color = UIAvatar.color(message.author.id);
    if (sender) item.setAttribute(message.is_outgoing ? 'right' : 'left', '');
    if (sender && !message.is_outgoing) item.append(UIAvatar.from(sender, color, message.author && message.author.profile_photo && message.author.profile_photo.small));

    let content;

    if (message.content['@type'] === 'messageSticker') {
      content = MessageSticker.from(message.content.sticker, timestamp);
      item.append(content);
      return node.append(item);
    }

    // TODO:
    // messagePhoto
    // messageAnimation
    // messageAudio
    // messageVoiceNote
    // messageVideo?
    // document?

    const text = message.content['@type'] === 'messageText'
      ? message.content.text.text
      : 'не поддерживается '+ message.content['@type'];

    const emoji = MessageEmoji.test(text);

    content = emoji
      ? new MessageEmoji()
      : new MessageText();

    if (sender) content.setAttribute(message.is_outgoing ? 'right' : 'left', '');
    if (timestamp) content.setAttribute('timestamp', timestamp);
    if (sender && color) content.setAttribute('color', color);

    if (!emoji && !message.is_outgoing) {
      const author = document.createElement('span');
      author.innerText = sender;
      author.slot = 'author';
      content.append(author);
    }

    const span = document.createElement('span');
    span.innerText = text;
    span.slot = 'content';
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

