import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-online');
const attributes = {
    status(root, value) {
        if (value === 'online') {
            updateChildrenAttribute(root, '#status', 'class', 'online');
        }
        updateChildrenHTML(root, '#status', value);
    },
};

const properties = {}

export default class UiOnline extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UiOnline, component, {attributes, properties});
