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
import MessageDocument from '../../message/document/message-document.js';

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
  const history = [...last.messages, ...prev.messages];
  const members = await getUsers([...new Set(history.map(m => m.sender_user_id))]);
  history.forEach(m => m.author = members[m.sender_user_id]);

  insertDates(history);
  const messages = collapseMessages(history);

  messages.forEach(m => createMessage(m, root));
  list.innerHTML = '';
  list.append(root);
    // loading.style.display = 'none';
}

/** */
  function collapseMessages(history) {
    const messages = [];
    let current;
    let message = [];
    history.forEach(h => {
      const sender = h.author && h.author.id || undefined;
      if (sender === current) return message.push(h);
      if (message.length) messages.push(message);
      current = sender;
      message = [h];
    });
    if (message.length) messages.push(message);
    return messages;
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
  function createMessage(messages, node) {
    const sender = messages[0].author
      ? messages[0].author.first_name + ' ' + messages[0].author.last_name
      : '';

    const item = new AppMessage();
    const outgoing = messages[0].is_outgoing;
    let color;
    if (sender) color = UIAvatar.color(messages[0].author.id);
    if (sender) item.setAttribute(outgoing ? 'right' : 'left', '');
    if (sender && !outgoing) item.append(UIAvatar.from(sender, color, messages[0].author && messages[0].author.profile_photo && messages[0].author.profile_photo.small));

    messages.forEach((message, index) => createMessageItem(message, index, item, sender, outgoing, color));

    node.append(item);
  }

/** */
  function createMessageItem(message, index, root, sender, outgoing, color) {
    let content;
    const timestamp = AppMessage.timestamp(message.date);
    if (message.content['@type'] === 'messageSticker') {
      content = MessageSticker.from(message.content.sticker, timestamp);
      return root.append(content);
    }

    if (message.content['@type'] === 'messageDocument') {
      content = MessageDocument.from(message.content.document, timestamp);
      content.setAttribute(outgoing ? 'right' : 'left', '')
      return root.append(content);
    }

    // TODO:
    // messagePhoto
    // messageAnimation
    // messageAudio
    // messageVoiceNote
    // messageVideo?

    let text = message.content['@type'] === 'messageText'
      ? message.content.text.text
      : `Doesn't supported `+ message.content['@type'].slice(7, message.content['@type'].length) + ' messages';

    const emoji = MessageEmoji.test(text);

    content = emoji
      ? new MessageEmoji()
      : new MessageText();

    if (sender) content.setAttribute(outgoing ? 'right' : 'left', '');
    if (timestamp) content.setAttribute('timestamp', timestamp);
    if (sender && color) content.setAttribute('color', color);

    if (index === 0 && !emoji && !outgoing) {
      const author = document.createElement('span');
      author.innerText = sender;
      author.slot = 'author';
      content.append(author);
    }


    if (message.content.web_page) {

      const web_page = message.content.web_page;
      const web = document.createElement('div');
      web.setAttribute('class', 'web');
      web.slot = 'web-page';
      web.addEventListener('click', () => {
        window.open(web_page.url,'_blank');
      });
      const img = document.createElement('img');
      if (web_page.photo && web_page.photo.sizes[0].photo) {
        File.getFile(web_page.photo.sizes[0].photo)
            .then(blob => img.setAttribute('src', blob));
      }
      web.append(img);

      if (web_page.site_name) {
        const name = document.createElement('span');
        name.innerText = web_page.site_name;
        name.setAttribute('class', 'name');
        web.append(name);
      }


      if (web_page.title) {
        const title = document.createElement('span');
        title.innerText = web_page.title;
        title.setAttribute('class', 'title');
        web.append(title);
      }

      if (web_page.description) {
        const descr = document.createElement('span');
        descr.innerText = web_page.description;
        descr.setAttribute('class', 'descr');
        web.append(descr);
      }

      content.append(web);

      text = text.replace(
          /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g,
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

