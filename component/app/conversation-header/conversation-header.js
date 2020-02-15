import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import sidebarEvents from '../../layout/sidebar/events.js';

import UIAvatar from '../../ui/avatar/ui-avatar.js';
import '../../ui/icon/ui-icon.js';
import '../../ui/drop/ui-drop.js';
import '../../ui/online/ui-online.js';
import telegram from "../../../tdweb/Telegram.js";
import File from "../../../script/File.js";
import {updateChildrenHTML} from "../../../script/DOM.js";

const component = Component.meta(import.meta.url, 'conversation-header');
const attributes = {}
const properties = {}

const formatter = new Intl.NumberFormat('en');

export default class ConversationHeader extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    $('.left', node).addEventListener('click', () => channel.send(sidebarEvents.OPEN_PROFILE, {chatId: this.store().chat_id}));
    $('#search', node).addEventListener('click', () => channel.send(sidebarEvents.OPEN_SEARCH, {chatId: this.store().chat_id}));

    const drop = $('ui-drop', node);
    $('#more', node).addEventListener('click', () => drop.show = !drop.show);

    init.call(this, node);
    return this;
  }

  render(node) {
    init.call(this, node);
  }

  renderPhoto = (photo, id, letter) => {
    const avatar = $('ui-avatar', this.shadowRoot);
    if (photo) {
      File.getFile(photo.small)
        .then(blob => {
          avatar.setAttribute('src', blob);
        });
    }
    avatar.setAttribute('color', UIAvatar.color(id));
    avatar.innerText = UIAvatar.letter(letter);
  };
}

Component.init(ConversationHeader, component, {attributes, properties});

/** */
async function init(node) {
  const store = this.store();
  if (!store) return;
  const {chat} = store;
  if (!chat) return;

  if (node.childElementCount === 0) return;

  $('.title', node).innerText = chat.title;
  this.renderPhoto(chat.photo, chat.type.user_id || chat.type.supergroup_id || chat.type.basic_group_id, chat.title);
  if (chat.type['@type'] === 'chatTypePrivate') {
    // user profile getUserFullInfo
    telegram.api('getUser', {
      user_id: chat.type.user_id
    }).then((user) => {
      let status = user.status['@type'] === 'userStatusOnline' ? 'online' : user.status.was_online;
      if (user.status['@type'] === 'userStatusRecently') {
        status = 'hidden';
      }
      $('ui-online', node)
        .setAttribute('status', status);
      $('ui-online', node)
        .setAttribute('id', user.id);
    });
  } else if (chat.type['@type'] === 'chatTypeSupergroup') {
    telegram.api('getSupergroupFullInfo', {
      supergroup_id: chat.type.supergroup_id
    }).then(groupFull => {
      $('ui-online', node).style.display = 'none';
      const statusBlock = $('.status', node);
      if (chat.type.is_channel) {
        statusBlock.innerText = `${formatter.format(groupFull.member_count)} subscribers`;
      } else {
        statusBlock.innerText = `${formatter.format(groupFull.member_count)} members, TODO online`;
      }
    });
  } else if (chat.type['@type'] === 'chatTypeBasicGroup') {
    telegram.api('getBasicGroupFullInfo', {
      basic_group_id: chat.type.basic_group_id
    }).then(groupFull => {
      $('ui-online', node).style.display = 'none';
      const statusBlock = $('.status', node);
      statusBlock.innerText = `${formatter.format(groupFull.members.length)} members, TODO online`;
    });
  }
}
