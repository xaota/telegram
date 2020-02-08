import Component from '../../../script/Component.js';
import {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-text');
const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, 'span', value) }
  }

const properties = {

  }

export default class MessageText extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageText, component, {attributes, properties});
