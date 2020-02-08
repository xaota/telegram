import Component from '../../../script/Component.js';
import {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-emoji');
const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, 'span', value) }
  }

const properties = {

  }

export default class MessageEmoji extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageEmoji, component, {attributes, properties});
