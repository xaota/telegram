import Component from '../../../script/Component.js';
import {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-emoji');
const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, 'span', value); }
  };

const properties = {

  };

export default class MessageEmoji extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }

  static test(text = '', max = 3) {
    const symbols = [...text]; // memory!
    const length = text.length, count = symbols.length;
    // todo
    if (length === count || count > max) return false; // точно строка, либо длинее, чем надо
    const test = symbols.slice(0, max);
    return test.every(c => c.charCodeAt(0) !== c.codePointAt(0));
  }
}

Component.init(MessageEmoji, component, {attributes, properties});
