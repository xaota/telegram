import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import telegram from '../../../tdweb/Telegram.js';

import sidebarEvents from '../sidebar/events.js';
import File from '../../../script/File.js';
import {formatDate} from '../../../script/helpers.js';

import '../../ui/search/ui-search.js';
import '../../ui/grid/ui-grid.js';
import UiMember from '../../ui/member/ui-member.js';
import UiAvatar from '../../ui/avatar/ui-avatar.js';
import '../../ui/list/ui-list.js';

const component = Component.meta(import.meta.url, 'layout-search');
const attributes = {

  }

const properties = {

  }

export default class LayoutSearch extends Component {
  constructor({chatId}) {
    super(component);
    this.chatId = chatId;
    this.messages = [];
    this.totalCount = 0;
    this.cancelFunc = () => {};
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('#close', node)
        .addEventListener('click', () => {
          channel.send(sidebarEvents.CLOSE_SIDEBAR);
        });
    // selectors
    this.countBlock = $('.count', node);
    this.messagesBlock = $('ui-grid', node);

    $('ui-search', node)
        .addEventListener('ui-search', (e) => {
            this.cancelFunc();
            this.messages = [];
            this.text = e.detail.value;
            this.getResult();
        });
    $('ui-list', node).addEventListener('list-overscroll', e => {
        if (e.detail.up && this.text) {
            this.cancelFunc();
            this.getResult(true);
        }
    });
    return this;
  }

  getResult = (append) => {
      if (append && this.totalCount === this.messages.length) {
          return;
      }
      let cancel = false;
      this.cancelFunc = () => cancel = true;
      // searchPublicChats
      telegram.api('searchChatMessages', {
          chat_id: this.chatId,
          query: this.text,
          sender_user_id: 0,
          from_message_id: this.messages.length ? this.messages[this.messages.length - 1].id : 0,
          offset: 0,
          limit: 20,
          filter: null
      })
          .then((res) =>{
              if (cancel) {
                  return;
              }
              this.totalCount = res.total_count;
              this.messages = this.messages.concat(res.messages);
              this.renderResult(res.messages, append);
          });
  };

  renderResult = (messages, append) => {
    this.countBlock.innerText = `${this.totalCount} messages found`; // TDOO pluralize
      if (!append) {
          this.messagesBlock.innerHTML = '';
      }
      if (messages.length === 0) {
          return;
      }
      messages.forEach(message => {
      const block = new UiMember();
      // запрос за пользователем
      telegram.api('getUser', {
        user_id: message.sender_user_id
      })
          .then((user) => {
            if (user.profile_photo) {
                File.getFile(user.profile_photo.small)
                    .then(blob => {
                        block.setAttribute('src', blob)
                    });
            }
            block.setAttribute('name', user.first_name + ' ' + user.last_name);
            block.setAttribute('right', formatDate(message.date, true));
            block.setAttribute('color', UiAvatar.color(user.id));
            block.setAttribute('letter', UiAvatar.letter(user.first_name + ' ' + user.last_name));
          });
      const div = document.createElement('div');
      div.setAttribute('class', 'desc');
      const findTextLower = this.text.toLowerCase();
      let founded = '';
      let origin = '';
      if (message.content.text && message.content.text.text.toLowerCase().indexOf(findTextLower) > -1) {
          founded = message.content.text.text;
          origin = message.content.text.text;
      } else if (message.content.caption && message.content.caption.text && message.content.caption.text.toLowerCase().indexOf(findTextLower) > -1) {
          founded = message.content.caption.text;
          origin = message.content.caption.text;
      } else if (message.content.document && message.content.document.file_name.toLowerCase().indexOf(findTextLower) > -1) {
          founded = message.content.document.file_name;
          origin = message.content.document.file_name;
      }

      if (!origin) {
          origin = (
              (message.content.text && message.content.text.text) ||
              (message.content.caption && message.content.caption.text && message.content.caption.text) ||
              (message.content.document && message.content.document.file_name) ||
              (message.content['@type'].replace('message', ''))
          );
      }
      founded.replace('\n', '');
      origin.replace('\n', '');
      if (founded) {
          const index = founded.indexOf(findTextLower);
          const start = index > 20 ? index - 20 : 0;
          const endStart = index + findTextLower.length;
          div.append(document.createTextNode(origin.slice(start, index)));

          const span = document.createElement('span');
          span.innerText = origin.slice(index, index + this.text.length);
          div.append(span);

          const end = origin.slice(endStart, origin.length);
          div.append(document.createTextNode(end.slice(0, 40)));
      } else {
          div.innerText = origin.slice(0, 40);
      }
      block.append(div);
      this.messagesBlock.append(block);
    });
  };
}

Component.init(LayoutSearch, component, {attributes, properties});
