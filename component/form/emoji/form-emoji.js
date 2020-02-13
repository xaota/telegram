import Component from '../../../script/Component.js';
import telegram from '../../../tdweb/Telegram.js';

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
            'flag',
        ],
    },
    stickers: {
        list: {},
        selectedGroup: '',
        groups: [],
    },
    gifs: {
      list: [],
    },
};

const unionElements = (elements, render = null) => {
  return elements.reduce((s, el) => {
    return s + (render ? render(el) : `<div>${el}</div>`)
  }, '');
};

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
      if (this.selectedTab === 'stickers') {
        this.list.innerHTML = unionElements(tab.list[selectedGroup], (el) => {
            return `<div id="${el.sticker.id}">${el.emoji}</div>`;
        });
        return;
    }
    if (!tab.groups) {
        this.list.innerHTML = unionElements(tab.list);
        return;
    }
    this.list.innerHTML = unionElements(tab.list[selectedGroup]);
  };

  renderGroup = () => {
    const tab = tabs[this.selectedTab];
    if (this.selectedTab === 'emojies' || this.selectedTab === 'gifs') {
        if (!tab.groups) {
            this.group.innerHTML = '';
            this.group.style.display = 'none';
            return;
        }
        this.group.style.display = 'flex';
        this.group.innerHTML = unionElements(tab.groups, (el) => {
            return `<div class="item" active="${tab.selectedGroup === el}"><ui-icon id="${el}">${el}</ui-icon></div>`;
        });
    } else if (this.selectedTab === 'stickers') {
        this.group.innerHTML = unionElements(tab.groups, (el) => {
            return `<div class="item">${el.title}</div>`;
        });
    }
  };

  onSelectGroup = (e) => {
      if (!e.target.getAttribute("id")) {
          return;
      }
      $(`#${tabs[this.selectedTab].selectedGroup}`, this.group)
          .parentNode
          .removeAttribute('active');

      e.target.parentNode.setAttribute('active', 'true');
      tabs[this.selectedTab].selectedGroup = e.target.getAttribute("id");
      this.renderList();
  };

  onSelectTab = (e) => {
      const id = e.target.getAttribute('id');
      if (id && id !== this.selectedTab) {
          $(`#${this.selectedTab}`, this.shadowRoot).removeAttribute('selected');
          e.target.setAttribute('selected', '');
          this.selectedTab = id;
          this.renderList();
          this.renderGroup();
      }
  };

  onSelectElement = (e) => {
      if (e.target.classList.toString().indexOf('list') === -1) {
          switch (this.selectedTab) {
              case 'emojies':
                  this.event('emoji-select', {emoji: e.target.innerHTML});
                  break;
              case 'stickers':
                  this.event('sticker-select', {id: e.target.getAttribute('id')});
                  break;
          }
      }
  };
}

Component.init(FormEmoji, component, {attributes, properties});

const getStickers = async () => {
    const recent = await telegram.api('getRecentStickers', {
        is_attached: false
    });
    const result = await telegram.api('getInstalledStickerSets', {
        s_masks: false
    });
    const promises = [];
    result.sets.forEach(x => {
        promises.push(
            telegram.api('getStickerSet', {
                set_id: x.id
            })
        );
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
    sets.map((set) => {
        tabs.stickers.list[set.id] = set.stickers;
        tabs.stickers.groups.push({
            id: set.id,
            title: set.title
        });
    });

    console.log(tabs);
};
