import Component from '../../../script/Component.js';
import telegram from '../../../tdweb/Telegram.js';
import File from '../../../script/File.js';

import '../../ui/tab/ui-tab.js';
import '../../ui/tabs/ui-tabs.js';

import '../../ui/icon/ui-icon.js';
import $ from '../../../script/DOM.js';

// import {emojies} from './emojies.js';

const component = Component.meta(import.meta.url, 'form-emoji');
const attributes = {

};

const properties = {

};

const tabs = {
    emojies: {
        list: {
            time: [],
            emoji: ['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','😐','😑','😶','🙄','😏','😣','😥','😮','😯','😪','😫','😴','😌','😛','😜','😝','😒','😓','😔','😕','🙃','😲','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','😬','😰','😱','😳','😵','😡','😠','😷','😇','😈','👹','👺','💀','👻','👽','👾','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','👶','👦','👧','👨','👩','👴','👵','🎓','🏫','🌾','🍳','🔧','🏭','💼','🔬','💻','🎤','🎨','🚀','🚒','👮','🕵','💂','👷','👸','👳','👲','👰','👼','🎅','🙍','🙎','🙅','🙆','💁','🙋','🙇','💆','💇','🚶','🏃','💃','🕺','👯','🛀','🛌','🕴','🗣','👤','👥','🏇','🏂','🏌','🏄','🚣','🏊','🏋','🚴','🚵','🏎','🏍','👫','👬','👭','💋','💪','👈','👉','👆','👇','🖖','🖐','👌','👍','👎','👊','👋','👏','👐','🙌','🙏','💅','👂','👃','👣','👀','👁','🗨','👅','👄','💘','💓','💔','💕','💖','💗','💙','💚','💛','💜','🖤','💝','💞','💟','💌','💤','💢','💣','💥','💦','💨','💫','💬','🗨','🗯','💭','🕳','👓','🕶','👔','👕','👖','👗','👘','👙','👚','👛','👜','👝','🛍','🎒','👞','👟','👠','👡','👢','👑','👒','🎩','🎓','📿','💄','💍','💎'],
            cat: ['😎'],
            apple: [],
            car: [],
            ball: [],
            bulb: [],
            flag: []
        },
        selectedGroup: 'emoji',
        groups: [
            'time',
            'emoji',
            'cat',
            'apple',
            'car',
            'ball',
            'bulb',
            'flag'
        ]
    },
    stickers: {
        list: {},
        selectedGroup: '',
        groups: []
    },
    gifs: {
      list: []
    }
};

const unionElements = (elements, render = null) => elements.reduce((s, el) => s + (render ? render(el) : `<div>${el}</div>`), '');

export default class FormEmoji extends Component {
    constructor() {
    super(component);
    this.selectedTab = 'emojies';
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('ui-tabs', node).addEventListener('click', this.onSelectTab);

    this.group = $('.group', node);
    this.group.addEventListener('click', this.onSelectGroup);

    this.list = $('.list', node);
    this.list.addEventListener('click', this.onSelectElement);

    this.renderList();
    this.renderGroup();
    getStickers();
    return this;
  }

  renderList = () => {
    const tab = tabs[this.selectedTab];
    const selectedGroup = tab.selectedGroup;
    this.list.innerHTML = '';
    switch (this.selectedTab) {
        case 'stickers':
            tab.list[selectedGroup].forEach((el, i) => {
                const img = document.createElement('img');
                img.setAttribute('id', 'g' + i);
                File.getFile(el.thumbnail.photo)
                    .then(blob => {
                        img.setAttribute('src', blob);
                        this.list.append(img);
                    });
            });
            break;
        case 'emojies':
            tab.list[selectedGroup].forEach(el => {
                const div = document.createElement('div');
                div.innerHTML = el;
                this.list.append(div);
            });
            break;
    }
  };

  renderGroup = () => {
    const tab = tabs[this.selectedTab];
      this.group.innerHTML = '';
      if (!tab.groups) {
          this.group.style.display = 'none';
          return;
      } 
          this.group.style.display = 'flex';
      
      switch (this.selectedTab) {
          case 'emojies':
              this.group.innerHTML = unionElements(tab.groups, el => `<div class="item" active="${tab.selectedGroup === el}"><ui-icon id="${el}">${el}</ui-icon></div>`);
              break;
          case 'stickers':
              tab.groups.forEach(group => {
                  const div = document.createElement('div');
                  div.setAttribute('active', tab.selectedGroup === group.id);
                  div.setAttribute('class', 'item');
                  const img = document.createElement('img');
                  img.setAttribute('id', 'g' + group.id);
                  div.append(img);
                //   console.log(11, tab.list[group.id][0]);
                  File.getFile(tab.list[group.id][0].thumbnail.photo)
                      .then(blob => {
                          img.setAttribute('src', blob);
                          // img.setAttribute('width', '50px');
                          // img.setAttribute('height', '50px');
                      });
                  this.group.append(div);
              });
      }
  };

  onSelectGroup = e => {
      if (!e.target.getAttribute("id")) {
          return;
      }
      const selector = this.selectedTab === 'stickers' ? `#g${tabs[this.selectedTab].selectedGroup}` : `#${tabs[this.selectedTab].selectedGroup}`;
      $(selector, this.group)
          .parentNode
          .removeAttribute('active');

      e.target.parentNode.setAttribute('active', 'true');
      let newGroup = e.target.getAttribute("id");
      if (this.selectedTab === 'stickers') {
          newGroup = newGroup.slice(1);
      }
      tabs[this.selectedTab].selectedGroup = newGroup;
      this.renderList();
  };

  onSelectTab = e => {
      const id = e.target.getAttribute('id');
      if (id && id !== this.selectedTab) {
          $(`#${this.selectedTab}`, this.shadowRoot).removeAttribute('selected');
          e.target.setAttribute('selected', '');
          this.selectedTab = id;
          this.renderList();
          this.renderGroup();
      }
  };

  onSelectElement = e => {
      if (e.target.classList.toString().indexOf('list') === -1) {
          switch (this.selectedTab) {
              case 'emojies':
                  this.event('emoji-select', {emoji: e.target.innerHTML});
                  break;
              case 'stickers':
                  const sticker = tabs.stickers.list[tabs.stickers.selectedGroup][e.target.getAttribute('id').slice(1)]; // eslint-disable-line
                  this.event('sticker-select', {sticker});
                  break;
          }
      }
  };
}

Component.init(FormEmoji, component, {attributes, properties});

const getStickers = async () => {
    // const recent = await telegram.api('getRecentStickers', {
    //     is_attached: false
    // });
    const result = await telegram.api('getInstalledStickerSets', {
        s_masks: false
    });
    const promises = [];
    result.sets.forEach(x => {
        promises.push(telegram.api('getStickerSet', {
                set_id: x.id
            }));
    });

    const sets = await Promise.all(promises);
    tabs.stickers.selectedGroup = sets[0].id;
    // console.log(3, sets);
    // const slicedSets = sets.slice(0, 5);
    // const headerStickers = sets.reduce((preview, set) => {
    //     if (set.stickers.length > 0) {
    //         preview.push(set.stickers[0]);
    //     }
    //     return preview;
    // }, []);
    //
    // console.log(4, slicedSets);
    // console.log(5, headerStickers);
    sets.forEach(set => {
        tabs.stickers.list[set.id] = set.stickers;
        tabs.stickers.groups.push({
            id: set.id,
            title: set.title
        });
    });
};
