import Component from '../../../script/Component.js';
import $, {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

import File from '../../../script/File.js';
import {updateChildrenAttribute} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-photo');
const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, '#time', value) }
  }
const properties = {}

export default class MessagePhoto extends Component {
  constructor(data) {
    super(component);
    this.store(data);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const data = this.store().photo;
    const caption = this.store().caption;
    if (caption.text) {
        const t = $('#text', node);
        t.innerText = caption.text;
        t.style.padding = '8px 6px';
    } else {
        $('.main', node).classList.add('solo');
    }
    File.getFile(((data.sizes[0] && data.sizes[0].photo) || data.sizes[1] && data.sizes[1].photo)).then(blob => updateChildrenAttribute(node, 'img', 'src', blob));
    return this;
  }

  static from(data) {
    const content = new MessagePhoto(data);
    content.timestamp = data.timestamp;
    return content;
  }
}

Component.init(MessagePhoto, component, {attributes, properties});
