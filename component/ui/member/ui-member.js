import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenHTML} from '../../../script/DOM.js';
import '../avatar/ui-avatar.js';

const component = Component.meta(import.meta.url, 'ui-member');
const attributes = {
    src(root, value) {
        updateChildrenAttribute(root, 'ui-avatar', 'src', value);
    },
    color(root, value) {
        updateChildrenAttribute(root, 'ui-avatar', 'color', value);
    },
    letter(root, value) {
        updateChildrenHTML(root, 'ui-avatar', value);
    },
    name(root, value) {
        updateChildrenHTML(root, '#name', value);
    },
    right(root, value) {
        updateChildrenHTML(root, '.right', value);
    }
};

const properties = {}

export default class UIMember extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UIMember, component, {attributes, properties});
