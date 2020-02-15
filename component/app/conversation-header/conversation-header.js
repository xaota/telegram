import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import sidebarEvents from '../../layout/sidebar/events.js';

import UIAvatar from '../../ui/avatar/ui-avatar.js';
import '../../ui/icon/ui-icon.js';
import '../../ui/drop/ui-drop.js';
import '../../ui/online/ui-online.js';
import telegram from "../../../tdweb/Telegram.js";
import File from "../../../script/File.js";

const component = Component.meta(import.meta.url, 'conversation-header');
const attributes = {
    chat(root, value) {
        root.chat = value;
    }
  }

const properties = {

  }

const formatter = new Intl.NumberFormat('en');

export default class ConversationHeader extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('.left', node)
        .addEventListener('click', () => {
          channel.send(sidebarEvents.OPEN_PROFILE, {
              chatId: +this.chat,
          });
        });
    $('#search', node)
        .addEventListener('click', () => {
            channel.send(sidebarEvents.OPEN_SEARCH, {chatId: +this.chat});
        });
      telegram.api('getChat', {
          chat_id: this.chat,
      }).then(res => {
          $('.title', node).innerText = res.title;
          this.renderPhoto(res.photo, res.type.user_id || res.type.supergroup_id, res.title);
          if (res.type['@type'] === 'chatTypePrivate') {
              // user profile getUserFullInfo
              telegram.api('getUser', {
                  user_id: res.type.user_id
              }).then((user) => {
                  $('ui-online', node)
                      .setAttribute('status', user.status['@type'] === 'userStatusOnline' ? 'online' : user.status.was_online);
              });
          } else if (res.type['@type'] === 'chatTypeSupergroup') {
              telegram.api('getSupergroupFullInfo', {
                  supergroup_id: res.type.supergroup_id
              }).then(groupFull => {
                  $('ui-online', node).style.display = 'none';
                  const statusBlock = $('.status', node);
                  if (res.type.is_channel) {
                      statusBlock.innerText = `${formatter.format(groupFull.member_count)} subscribers`;
                  } else {
                      statusBlock.innerText = `${formatter.format(groupFull.member_count)} members, TODO online`;
                  }
              });
          } else if (res.type['@type'] === 'chatTypeBasicGroup') {
              telegram.api('getBasicGroupFullInfo', {
                  basic_group_id: res.type.basic_group_id
              }).then(groupFull => {
                  $('ui-online', node).style.display = 'none';
                  const statusBlock = $('.status', node);
                  statusBlock.innerText = `${formatter.format(groupFull.members.length)} members, TODO online`;
              });
          }

      });
    const drop = $('ui-drop', node);
    $('#more', node)
        .addEventListener('click', () => drop.show = !drop.show);
    return this;
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
        avatar.setAttribute('letter', UIAvatar.letter(letter));
    };
}

Component.init(ConversationHeader, component, {attributes, properties});
