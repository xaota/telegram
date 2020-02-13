import Component from '../../../script/Component.js';
import $, {channel, updateChildrenAttribute} from '../../../script/DOM.js';

import telegram from '../../../tdweb/Telegram.js';
import File from '../../../script/File.js';

import sidebarEvents from '../sidebar/events.js';
import '../../ui/grid/ui-grid.js';
import UiMember from '../../ui/member/ui-member.js';
import UiFile from '../../ui/file/ui-file.js';
import UiGrid from '../../ui/online/ui-online.js';
import UiIcon from '../../ui/icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'layout-profile');
const attributes = {

  }

const properties = {

  }

export default class LayoutProfile extends Component {
  constructor() {
    super(component);
    this.selectedTab = 'media';
    this.grid = new UiGrid();
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
      chat_id: -1001439848029// 304888926// 213592202
    }).then(res => {
      console.log(1, res);
      this.renderPhoto(res.photo);
      this.setTitle(res.title);

      if (res.type['@type'] === 'chatTypePrivate') {
        this.renderPhoto(res.photo);
        // user profile getUserFullInfo
        telegram.api('getUser', {
          user_id: res.type.user_id
        }).then((user) => {
          console.log(2, user);

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
          supergroup_id: 1439848029
        }).then(res => {
          const list = $('.list', node);
          if (res.description) {
            list.append(createItem('info', res.description, 'About'));
          }
          if (res.invite_link) {
            list.append(createItem('username', res.invite_link, 'Link'));
          }
          const statusBlock = $('.status', node);
          statusBlock.innerText = `${res.member_count} members, TODO online`;
        });
      }
    });
    this.tabContainer = $('#tabContainer', node);
    return this;
  }

  renderPhoto = (photo) => {
    File.getFile(photo.small)
        .then(blob => updateChildrenAttribute(this.shadowRoot, '.profile ui-avatar', 'src', blob));
  };

  setTitle = (title) => {
    $('.name', this.shadowRoot).innerText = title;
  };

  onSelectTab = (e) => {
    const id = e.target.getAttribute('id');
    if (id && id !== this.selectedTab) {
      $(`#${this.selectedTab}`, this.shadowRoot).removeAttribute('selected');
      e.target.setAttribute('selected', '');
      this.selectedTab = id;
      this.renderTabContent();
    }
  };

  renderTabContent = () => {
    // if (this.selectedTab === 'media') {
    //   this.grid.appendChild();
    //   this.tabContainer.appendChild(this.grid);
    // }
  };
}

Component.init(LayoutProfile, component, {attributes, properties});
