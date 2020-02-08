import Component from '../../../script/Component.js';

import UITab  from '../../ui/tab/ui-tab.js';
import UITabs from '../../ui/tabs/ui-tabs.js';

import '../../icon/emoji/icon-emoji.js';
import '../../icon/time/icon-time.js';
import '../../icon/cat/icon-cat.js';
import '../../icon/apple/icon-apple.js';
import '../../icon/car/icon-car.js';
import '../../icon/ball/icon-ball.js';
import '../../icon/bulb/icon-bulb.js';
import '../../icon/flag/icon-flag.js';
import $ from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'form-emoji');
const attributes = {

  }

const emojies = {
  time: [],
  emoji: ['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','😐','😑','😶','🙄','😏','😣','😥','😮','😯','😪','😫','😴','😌','😛','😜','😝','😒','😓','😔','😕','🙃','😲','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','😬','😰','😱','😳','😵','😡','😠','😷','😇','😈','👿','👹','👺','💀','👻','👽','👾','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','👶','👦','👧','👨','👩','👴','👵','👨','👩','👨','🎓','👩','🎓','👨','🏫','👩','🏫','👨','👩','👨','🌾','👩','🌾','👨','🍳','👩','🍳','👨','🔧','👩','🔧','👨','🏭','👩','🏭','👨','💼','👩','💼','👨','🔬','👩','🔬','👨','💻','👩','💻','👨','🎤','👩','🎤','👨','🎨','👩','🎨','👨','👩','👨','🚀','👩','🚀','👨','🚒','👩','🚒','👮','👮','👮','🕵','🕵','🕵','💂','💂','💂','👷','👷','👷','👸','👳','👳','👳','👲','👱','👱','👱','👰','👼','🎅','🙍','🙍','🙍','🙎','🙎','🙎','🙅','🙅','🙅','🙆','🙆','🙆','💁','💁','💁','🙋','🙋','🙋','🙇','🙇','🙇','💆','💆','💆','💇','💇','💇','🚶','🚶','🚶','🏃','🏃','🏃','💃','🕺','👯','👯','👯','🛀','🛌','🕴','🗣','👤','👥','🏇','🏂','🏌','🏌','🏌','🏄','🏄','🏄','🚣','🚣','🚣','🏊','🏊','🏊','🏋','🏋','🏋','🚴','🚴','🚴','🚵','🚵','🚵','🏎','🏍','👫','👬','👭','👩','💋','👨','👩','💋','👨','👨','💋','👨','👩','💋','👩','👩','👨','👩','👨','👨','👨','👩','👩','👨','👩','👦','👨','👩','👦','👨','👩','👧','👨','👩','👧','👦','👨','👩','👦','👦','👨','👩','👧','👧','👨','👨','👦','👨','👨','👧','👨','👨','👧','👦','👨','👨','👦','👦','👨','👨','👧','👧','👩','👩','👦','👩','👩','👧','👩','👩','👧','👦','👩','👩','👦','👦','👩','👩','👧','👧','👨','👦','👨','👦','👦','👨','👧','👨','👧','👦','👨','👧','👧','👩','👦','👩','👦','👦','👩','👧','👩','👧','👦','👩','👧','👧','💪','👈','👉','👆','🖕','👇','🖖','🖐','👌','👍','👎','👊','👋','👏','👐','🙌','🙏','💅','👂','👃','👣','👀','👁','👁','🗨','👅','👄','💋','💘','💓','💔','💕','💖','💗','💙','💚','💛','💜','🖤','💝','💞','💟','💌','💤','💢','💣','💥','💦','💨','💫','💬','🗨','🗯','💭','🕳','👓','🕶','👔','👕','👖','👗','👘','👙','👚','👛','👜','👝','🛍','🎒','👞','👟','👠','👡','👢','👑','👒','🎩','🎓','📿','💄','💍','💎'],
  cat: [],
  apple: [],
  car: [],
  ball: [],
  bulb: [],
  flag: []
};
const emojiesGroups = [
    'time',
    'emoji',
    'cat',
    'apple',
    'car',
    'ball',
    'bulb',
    'flag',
];

const properties = {

  }

const unionElements = (elements, wrapClass = '', render = null) => {
  console.log(elements);
  return elements.reduce((s, el) => {
    return s + (render ? render(el, wrapClass) : `<div class="${wrapClass}">${el}</div>`)
  }, '');
};

export default class FormEmoji extends Component {
  constructor() {
    super(component);
    this.selectedGroupEmojies = 'emoji';
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const list = $('.list', node);
    list.innerHTML = unionElements(emojies[this.selectedGroupEmojies]);

    const group = $('.group', node);
    group.innerHTML = unionElements(emojiesGroups, '', (el) => {
      return `<div class="item"><icon-${el}></icon-${el}></div>`;
    });
    return this;
  }
}

Component.init(FormEmoji, component, {attributes, properties});
