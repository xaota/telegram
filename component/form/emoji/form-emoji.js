import Component from '../../../script/Component.js';

import '../../ui/tab/ui-tab.js';
import '../../ui/tabs/ui-tabs.js';

import '../../icon/emoji/icon-emoji.js';
import '../../icon/time/icon-time.js';
import '../../icon/cat/icon-cat.js';
import '../../icon/apple/icon-apple.js';
import '../../icon/car/icon-car.js';
import '../../icon/ball/icon-ball.js';
import '../../icon/bulb/icon-bulb.js';
import '../../icon/flag/icon-flag.js';
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
            emoji: ['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','😐','😑','😶','🙄','😏','😣','😥','😮','😯','😪','😫','😴','😌','😛','😜','😝','😒','😓','😔','😕','🙃','😲','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','😬','😰','😱','😳','😵','😡','😠','😷','😇','😈','👿','👹','👺','💀','👻','👽','👾','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','👶','👦','👧','👨','👩','👴','👵','👨','👩','👨','🎓','👩','🎓','👨','🏫','👩','🏫','👨','👩','👨','🌾','👩','🌾','👨','🍳','👩','🍳','👨','🔧','👩','🔧','👨','🏭','👩','🏭','👨','💼','👩','💼','👨','🔬','👩','🔬','👨','💻','👩','💻','👨','🎤','👩','🎤','👨','🎨','👩','🎨','👨','👩','👨','🚀','👩','🚀','👨','🚒','👩','🚒','👮','👮','👮','🕵','🕵','🕵','💂','💂','💂','👷','👷','👷','👸','👳','👳','👳','👲','👱','👱','👱','👰','👼','🎅','🙍','🙍','🙍','🙎','🙎','🙎','🙅','🙅','🙅','🙆','🙆','🙆','💁','💁','💁','🙋','🙋','🙋','🙇','🙇','🙇','💆','💆','💆','💇','💇','💇','🚶','🚶','🚶','🏃','🏃','🏃','💃','🕺','👯','👯','👯','🛀','🛌','🕴','🗣','👤','👥','🏇','🏂','🏌','🏌','🏌','🏄','🏄','🏄','🚣','🚣','🚣','🏊','🏊','🏊','🏋','🏋','🏋','🚴','🚴','🚴','🚵','🚵','🚵','🏎','🏍','👫','👬','👭','👩','💋','👨','👩','💋','👨','👨','💋','👨','👩','💋','👩','👩','👨','👩','👨','👨','👨','👩','👩','👨','👩','👦','👨','👩','👦','👨','👩','👧','👨','👩','👧','👦','👨','👩','👦','👦','👨','👩','👧','👧','👨','👨','👦','👨','👨','👧','👨','👨','👧','👦','👨','👨','👦','👦','👨','👨','👧','👧','👩','👩','👦','👩','👩','👧','👩','👩','👧','👦','👩','👩','👦','👦','👩','👩','👧','👧','👨','👦','👨','👦','👦','👨','👧','👨','👧','👦','👨','👧','👧','👩','👦','👩','👦','👦','👩','👧','👩','👧','👦','👩','👧','👧','💪','👈','👉','👆','🖕','👇','🖖','🖐','👌','👍','👎','👊','👋','👏','👐','🙌','🙏','💅','👂','👃','👣','👀','👁','👁','🗨','👅','👄','💋','💘','💓','💔','💕','💖','💗','💙','💚','💛','💜','🖤','💝','💞','💟','💌','💤','💢','💣','💥','💦','💨','💫','💬','🗨','🗯','💭','🕳','👓','🕶','👔','👕','👖','👗','👘','👙','👚','👛','👜','👝','🛍','🎒','👞','👟','👠','👡','👢','👑','👒','🎩','🎓','📿','💄','💍','💎'],
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
        list: {
            'flag': ['😀','😁'],
            'bulb': ['😃','😄'],
        },
        selectedGroup: 'flag',
        groups: ['flag', 'bulb'],
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
    return this;
  }

  renderList = () => {
    const tab = tabs[this.selectedTab];
    if (!tab.groups) {
        this.list.innerHTML = unionElements(tab.list);
        return;
    }
    const selectedGroup = tab.selectedGroup;
    this.list.innerHTML = unionElements(tab.list[selectedGroup]);
  };

  renderGroup = () => {
    const tab = tabs[this.selectedTab];
    if (!tab.groups) {
      this.group.innerHTML = '';
      this.group.style.display = 'none';
      return;
    }
    this.group.style.display = 'flex';
    console.log(tab.selectedGroup);
    this.group.innerHTML = unionElements(tab.groups, (el) => {
        console.log(tab.selectedGroup === el);
        return `<div class="item" active="${tab.selectedGroup === el}"><icon-${el} id="${el}"></icon-${el}></div>`;
    });
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
      if (e.target.getAttribute('id')) {
          $(`#${this.selectedTab}`, this.shadowRoot).removeAttribute('selected');
          e.target.setAttribute('selected', '');
          this.selectedTab = e.target.getAttribute('id');
          this.renderList();
          this.renderGroup();
      }
  };

  onSelectElement = (e) => {
      console.log(e.target.innerHTML);
  };
}

Component.init(FormEmoji, component, {attributes, properties});
