import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-avatar');
const attributes = {
    src(root, value) {
      updateChildrenAttribute(root, 'img', 'src', value);
    },

    color(root, value) {
      this.style.backgroundColor = '#' + value;
    }
  }

const properties = {}

export default class UIAvatar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UIAvatar, component, {attributes, properties});
