import Component from '../../../script/Component.js';
import $, {channel, updateChildrenAttribute} from '../../../script/DOM.js';

import telegram from '../../../tdweb/Telegram.js';
import File from '../../../script/File.js';

import sidebarEvents from '../sidebar/events.js';
import '../../ui/grid/ui-grid.js';
import '../../ui/list/ui-list.js';
import UiMember from '../../ui/member/ui-member.js';
import UiFile from '../../ui/file/ui-file.js';
import UiGrid from '../../ui/grid/ui-grid.js';
import UiIcon from '../../ui/icon/ui-icon.js';
import UIAvatar from "../../ui/avatar/ui-avatar.js";

const component = Component.meta(import.meta.url, 'layout-profile');
const attributes = {

  }

const properties = {

  }

export default class LayoutProfile extends Component {
  constructor({chatId, profileId} = {}) {
    super(component);
    this.chatId = chatId;
    this.profileId = profileId;
    this.selectedTab = 'media';
    this.loadedItems = {
      media: [],
      docs: [],
    };
    this.totalCount = {
      media: 0,
      docs: 0,
    };
    this.cancelLoading = () => {};
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('#close', node)
        .addEventListener('click', () => {
          channel.send(sidebarEvents.CLOSE_SIDEBAR);
        });
    $('ui-tabs', node).addEventListener('click', this.onSelectTab);

    function createItem(_icon, _info, _desc) {
      const item = document.createElement('div');
      item.setAttribute('class', 'item');

      const left = document.createElement('div');
      left.setAttribute('class', 'left');
      const icon = new UiIcon(_icon);
      left.append(icon);

      const right = document.createElement('div');
      right.setAttribute('class', 'right');
      const info = document.createElement('div');
      info.innerText = _info;
      right.append(info);

      const desc = document.createElement('div');
      desc.setAttribute('class', 'desc');
      desc.innerText = _desc;
      right.append(desc);

      item.append(left);
      item.append(right);
      return item;
    }

    telegram.api('getChat', {
      chat_id: this.chatId,
    }).then(res => {
      this.setTitle(res.title);
      this.renderPhoto(res.photo, res.type.user_id || res.type.supergroup_id, res.title);

      if (res.type['@type'] === 'chatTypePrivate') {
        // user profile getUserFullInfo
        telegram.api('getUser', {
          user_id: res.type.user_id
        }).then((user) => {
          // online
          if (user.status['@type'] === 'userStatusOnline') {
            const statusBlock = $('.status', node);
            statusBlock.innerText = 'online';
            statusBlock.classList.add('online');
          }
          // profile
          const list = $('.list', node);
          list.append(createItem('username', user.username, 'Username'));
          if (user.phone_number) {
            list.append(createItem('phone', user.phone_number, 'Phone'));
          }

          // full info
          telegram.api('getUserFullInfo', {
            user_id: res.type.user_id
          }).then((userFullInfo) => {
            if (userFullInfo.bio) {
              list.append(createItem('info', user.bio, 'Bio'));
            }
          });
        });
      } else if (res.type['@type'] === 'chatTypeSupergroup') {
        telegram.api('getSupergroupFullInfo', {
          supergroup_id: res.type.supergroup_id
        }).then(groupFull => {
          const list = $('.list', node);
          if (groupFull.description) {
            list.append(createItem('info', groupFull.description, 'About'));
          }
          if (groupFull.invite_link) {
            list.append(createItem('username', groupFull.invite_link, 'Link'));
          }
          const statusBlock = $('.status', node);
          if (res.type.is_channel) {
            statusBlock.innerText = `${groupFull.member_count} members`;
          } else {
            statusBlock.innerText = `${groupFull.member_count} members, TODO online`;
          }
        });
      }
    });
    this.tabContainer = $('ui-list', node);
    this.tabContainer.addEventListener('list-overscroll', e => {
      if (e.detail.up) {
        if (this.totalCount[this.selectedTab] !== this.loadedItems[this.selectedTab].length) {
          this.loadData(true);
        }
      }
    });
    this.loadData();
    return this;
  }

  renderPhoto = (photo, id, letter) => {
    const avatar = $('.profile ui-avatar', this.shadowRoot);
    if (photo) {
      File.getFile(photo.small)
          .then(blob => {
            avatar.setAttribute('src', blob);
          });
    }
    avatar.setAttribute('color', UIAvatar.color(id));
    avatar.setAttribute('letter', UIAvatar.letter(letter));
  };

  setTitle = (title) => {
    $('.name', this.shadowRoot).innerText = title;
  };

  onSelectTab = (e) => {
    const id = e.target.getAttribute('id');
    if (id && id !== this.selectedTab) {
      this.cancelLoading();
      $(`#${this.selectedTab}`, this.shadowRoot).removeAttribute('selected');
      e.target.setAttribute('selected', '');
      this.selectedTab = id;
      this.loadData();
      // this.scrollTop = 0; TODO сделать какой-то скролл до стики элемента
    }
  };

  loadData = (append) => {
    const types = {
      media: {
        type: 'searchMessagesFilterPhoto',
        render: this.renderMedia,
      },
      docs: {
        type: 'searchMessagesFilterDocument',
        render: this.renderFiles,
      },
    };
    if (!append && this.loadedItems[this.selectedTab].length > 0) {
      types[this.selectedTab].render(this.loadedItems[this.selectedTab]);
      return;
    }
    let cancel = false;
    this.cancelLoading = () => cancel = true;
    telegram.api('searchChatMessages', {
      chat_id: this.chatId,
      query: '',
      sender_user_id: 0,
      from_message_id: this.loadedItems[this.selectedTab].length > 0 ?
          this.loadedItems[this.selectedTab][this.loadedItems[this.selectedTab].length - 1].id
          : 0,
      offset: 0,
      limit: 20,
      filter: {
        '@type': types[this.selectedTab].type,
      }
    }).then((res) => {
      if (cancel) {
        return;
      }
      this.totalCount[this.selectedTab] = res.total_count;
      this.loadedItems[this.selectedTab] = this.loadedItems[this.selectedTab].concat(res.messages);
      types[this.selectedTab].render(append ? res.messages : this.loadedItems[this.selectedTab], append);
    })
  };

    renderMedia = (messages, append) => {
      let grid;
      if (append) {
        grid = $('#media-grid', this.shadowRoot);
      } else {
        grid = new UiGrid();
      }
      grid.setAttribute('id', 'media-grid');
      grid.setAttribute('columns', 'repeat(3, 133px)');
      grid.setAttribute('row-gap', '5px');
      grid.setAttribute('column-gap', '5px');
      messages.forEach((message) => {
        const div = document.createElement('div');
        grid.append(div);
        File.getFile(message.content.photo.sizes[0].photo)
            .then((blob) => {
              div.style.backgroundImage = `url(${blob})`;
            });
      });
      if (!append) {
        this.tabContainer.innerHTML = '';
        this.tabContainer.append(grid);
      }
    };

    renderFiles = (messages, append) => {
      let grid;
      if (append) {
        grid = $('#docs-grid', this.shadowRoot);
      } else {
        grid = new UiGrid();
      }
      grid.setAttribute('id', 'docs-grid');
      grid.setAttribute('rows', 'auto');
      grid.setAttribute('columns', '100%');
      grid.setAttribute('row-gap', '24px');
      messages.forEach((message) => {
        const file = new UiFile({
          file: message.content.document,
          date: message.date,
        });
        grid.append(file);
      });
      if (!append) {
        this.tabContainer.innerHTML = '';
        this.tabContainer.append(grid);
      }
    };
}

Component.init(LayoutProfile, component, {attributes, properties});
