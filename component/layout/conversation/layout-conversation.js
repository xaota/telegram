import Component from '../../../script/Component.js';

import $ from '../../../script/DOM.js';

import UIList             from '../../ui/list/ui-list.js';
import UIMessage          from '../../ui/message/ui-message.js';
import LayoutLoading      from '../loading/layout-loading.js';
import ConversationInput  from '../../app/conversation-input/conversation-input.js';
import ConversationHeader from '../../app/conversation-header/conversation-header.js';

import MessageText  from '../../message/text/message-text.js';
import MessageEmoji from '../../message/emoji/message-emoji.js';

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
  constructor() {
    super(component);
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
    return this;
  }
}

Component.init(LayoutConversation, component, {attributes, properties});
