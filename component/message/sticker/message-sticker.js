import Component from '../../../script/Component.js';
import {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

import File from '../../../script/File.js';
import {updateChildrenAttribute} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-sticker');
const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, 'span', value) }
  }
const properties = {}

export default class MessageSticker extends Component {
  constructor(data) {
    super(component);
    this.store(data);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const data = this.store();
    File.getFile(data.sticker).then(blob => updateChildrenAttribute(node, 'img', 'src', blob));
    return this;
  }

  static from(sticker, time) {
    const content = new MessageSticker(sticker);
    content.timestamp = time;
    return content;
  }
}

Component.init(MessageSticker, component, {attributes, properties});
