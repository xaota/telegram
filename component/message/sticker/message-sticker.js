import Component from '../../../script/Component.js';
import {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

import File from '../../../script/File.js';
import {updateChildrenAttribute} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-sticker');
const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, 'span', value) }
  }

const properties = {

  }

export default class MessageSticker extends Component {
  constructor(sticker) {
    super(component);
    this.sticker = sticker;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    File.getFile(this.sticker.sticker)
        .then((blob) => {
          updateChildrenAttribute(node, 'img', 'src', blob);
        });
    return this;
  }
}

Component.init(MessageSticker, component, {attributes, properties});
