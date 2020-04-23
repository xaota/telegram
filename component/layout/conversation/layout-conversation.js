import Component from '../../../script/Component.js';

import $, {channel} from '../../../script/DOM.js';
import File from '../../../script/File.js';
import telegram from '../../../tdweb/Telegram.js';
import {formatDate, dateDay} from '../../../script/helpers.js';

/* eslint-disable */
import UIFAB              from '../../ui/fab/ui-fab.js';
import UIList             from '../../ui/list/ui-list.js';
import UIAvatar           from '../../ui/avatar/ui-avatar.js';
import AppMessage         from '../../app/message/app-message.js';
import LayoutLoading      from '../loading/layout-loading.js';
import ConversationInput  from '../../app/conversation-input/conversation-input.js';
import ConversationHeader from '../../app/conversation-header/conversation-header.js';

import MessageText     from '../../message/text/message-text.js';
import MessageEmoji    from '../../message/emoji/message-emoji.js';
import MessageSticker  from '../../message/sticker/message-sticker.js';
import MessageDocument from '../../message/document/message-document.js';
import MessagePhoto    from '../../message/photo/message-photo.js';
/* eslint-enable */

import '../sidebar/layout-sidebar.js';
import '../../ui/tabs/ui-tabs.js';
import '../../ui/tab/ui-tab.js';
import '../../ui/icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'layout-conversation');
const attributes = {};
const properties = {};

export default class LayoutConversation extends Component {
  constructor(data) {
    super(component);
    this.store(data);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const aside   = $('aside', node);
    const list    = $('ui-list', node);
    const sidebar = $('layout-sidebar', node);

    $('conversation-header', node).addEventListener('open-profile', _ => aside.style.display = 'flex');
    $('conversation-header', node).addEventListener('open-search', _ => aside.style.display = 'flex');
    sidebar.addEventListener('close-sidebar', _ => aside.style.display = 'none');

    $('ui-fab', node).addEventListener('click', _ => {
      if (list.firstElementChild) list.firstElementChild.scrollIntoView({block: 'end', behavior: 'smooth'});
    });

    return this;
  }

  render(node) {
    const list = $('ui-list', node);
    init.call(this, node, list);
    return this;
  }

  unmount(node) {
    const {chat_id: chatId} = this.store();
    telegram.api('closeChat', {chatId});
    return this;
  }
}

Component.init(LayoutConversation, component, {attributes, properties});

async function init(node, list) {
  const {chat_id: chatId} = this.store();
  const chat = await telegram.api('getChat', {chat_id: chatId});

  $('conversation-header', node).store({chat_id: chatId, chat});

  const input = $('conversation-input', node);
  input.store({chat_id: chatId});
  if (!chat.permissions.can_send_messages) input.style.display = 'none';

  getHistory(chatId, list);
  telegram.api('openChat', {chat_id: chatId}); // await?

  channel.on('chat.permissions', () => {
    debugger; // eslint-disable-line
  });

  channel.on('message.new', message => {
    if (message.chat_id !== chatId) return;
    getHistory(chatId, list);
  });

  $('layout-loading', node).remove();
}

async function getHistory(chatId, list) {
  const root = document.createDocumentFragment();
  const chat = await telegram.api('getChat', {chat_id: chatId});
  const fromMessageId = chat.last_message.id;

  const buffer = await Promise.all([ // faster!
    getChatHistory(chatId),
    getChatHistory(chatId, fromMessageId)
  ]).then(([last, prev]) => [...last.messages, ...prev.messages]);

  const temp = {};
  buffer.forEach(h => temp[h.id] = h);
  const history = Object.values(temp).sort((a, b) => b.date - a.date);

  const members = await getUsers([...new Set(history.map(m => m.sender_user_id))]);
  history.forEach(m => m.author = members[m.sender_user_id]);

  insertDates(history);
  const messages = collapseMessages(history);

  const items = messages.map(createMessage);
  items.forEach(e => root.append(e));

  list.innerHTML = '';
  list.append(root);

  const ids = history.map(h => h.id);
  const index = ids.indexOf(chat.last_read_inbox_message_id);
  if (index > 0) telegram.api('viewMessages', {chat_id: chatId, message_ids: ids.slice(0, index)}); // "юзер читает" входящие

  // loading.style.display = 'none';

  list.firstElementChild.scrollIntoView({block: 'end', behavior: 'smooth'});
}

/** collapseMessages */
  function collapseMessages(history) {
    const messages = [];
    let current;
    let message = [];
    history.forEach(h => {
      const sender = h.author && h.author.id || h.is_channel_post || undefined;
      if (sender === current) return message.push(h);
      if (message.length) messages.push({hash: message[0].id + 'x' + message.length, messages: message});
      current = sender;
      message = [h];
    });
    if (message.length) messages.push({hash: message[0].id + 'x' + message.length, messages: message});
    return messages;
  }

/** insertDates */
  function insertDates(messages) {
    let current = dateDay(messages[0].date * 1000);
    let message = formatDate(current, true);
    for (let i = 1; i < messages.length; ++i) {
      const day  = dateDay(messages[i].date * 1000);
      const temp = formatDate(day, true);
      if (temp !== message) {
        messages.splice(i, 0, {id: current.valueOf(), content: {'@type': 'messageText', text: {text: message}}});

        message = temp;
        current = day;
        ++i;
      }
    }
    messages.push({id: current.valueOf(), content: {'@type': 'messageText', text: {text: message}}});
  }

/** */
  function createMessage({hash, messages}) {
    messages = messages.reverse();

    const sender = messages[0].author
      ? messages[0].author.first_name + ' ' + messages[0].author.last_name
      : '';

    const item = new AppMessage();
    const outgoing = messages[0].is_outgoing;
    const side = messages[0].is_channel_post
      ? 'left'
      : outgoing
        ? 'right'
        : sender
          ? 'left'
          : '';

    let color;
    if (sender) color = UIAvatar.color(messages[0].author.id);
    if (side) item.setAttribute(side, '');
    if (sender && !outgoing) item.append(UIAvatar.from(sender, color, messages[0].author && messages[0].author.profile_photo && messages[0].author.profile_photo.small));

    messages.forEach((message, index) => createMessageItem(message, index, item, sender, outgoing, side, color));

    item.dataset.hash = hash;
    return item;
  }

/** */
  function createMessageItem(message, index, root, sender, outgoing, side, color) {
    let content;
    const timestamp = AppMessage.timestamp(message.date);
    if (message.content['@type'] === 'messageSticker') {
      content = MessageSticker.from(message.content.sticker, timestamp);
      return root.append(content);
    }

    if (message.content['@type'] === 'messageDocument') {
      content = MessageDocument.from(message.content.document, timestamp);
      content.setAttribute(side, '');
      return root.append(content);
    }
    if (message.content['@type'] === 'messagePhoto') {
      content = MessagePhoto.from({
        photo: message.content.photo,
        timestamp,
        caption: message.content.caption
      });
      content.setAttribute(outgoing ? 'right' : 'left', '');
      return root.append(content);
    }

    // TODO:
    // messagePhoto
    // messageAnimation
    // messageAudio
    // messageVoiceNote
    // messageVideoNote

    let text;
    const type = message.content['@type'];
    switch (type) {
      case 'messageText':
        text = message.content.text.text;
        break;
      case 'messageChatAddMembers':
        text = 'Added (user_ids) to chat: ' + message.content.member_user_ids.join(', ');
        break;
      case 'messageBasicGroupChatCreate':
        text = 'Created Group';
        break;
      default:
        text = `Doesn't supported ${type.slice(7)} messages`;
    }

    const emoji = MessageEmoji.test(text);

    content = emoji
      ? new MessageEmoji()
      : new MessageText();

    if (sender) content.setAttribute(side, '');
    if (timestamp) content.setAttribute('timestamp', timestamp);
    if (sender && color) content.setAttribute('color', color);

    if (index === 0 && !emoji && !outgoing) {
      const author = document.createElement('span');
      author.innerText = sender;
      author.slot = 'author';
      content.append(author);
    }


    if (message.content.web_page) {
      const webPage = message.content.web_page;
      const web = document.createElement('div');
      web.setAttribute('class', 'web');
      web.slot = 'web-page';
      web.addEventListener('click', () => {
        window.open(webPage.url,'_blank');
      });
      const img = document.createElement('img');
      if (webPage.photo && webPage.photo.sizes[0].photo) {
        File.getFile(webPage.photo.sizes[0].photo)
            .then(blob => img.setAttribute('src', blob));
      }
      web.append(img);

      if (webPage.site_name) {
        const name = document.createElement('span');
        name.innerText = webPage.site_name;
        name.setAttribute('class', 'name');
        web.append(name);
      }


      if (webPage.title) {
        const title = document.createElement('span');
        title.innerText = webPage.title;
        title.setAttribute('class', 'title');
        web.append(title);
      }

      if (webPage.description) {
        const descr = document.createElement('span');
        descr.innerText = webPage.description;
        descr.setAttribute('class', 'descr');
        web.append(descr);
      }

      content.append(web);

      text = text.replace(
          /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g, // eslint-disable-line
          '<a href="$1">$1</a>'
      );

      const span = document.createElement('span');
      span.innerHTML = text;
      span.slot = 'content';
      content.append(span);
    } else {
      const span = document.createElement('span');
      span.innerText = text;
      span.slot = 'content';
      content.append(span);
    }

    root.append(content);
  }

/** getUsers */
  async function getUsers(userIds) {
    userIds = userIds
      .filter(e => e !== 0)
      .map(userId => telegram.api('getUser', {userId}));
    const data = await Promise.all(userIds);
    const users = {};
    data.forEach(u => users[u.id] = u);
    return users;
  }

/** getChatHistory */
  function getChatHistory(chatId, fromMessageId = 0, offset = 0, limit = 30) {
    const options = {chat_id: chatId, fromMessageId, offset, limit, only_local: false};
    return telegram.api('getChatHistory', options);
  }

