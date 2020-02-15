import Component from '../../../script/Component.js';
import $, {cssVariable, updateChildrenHTML} from '../../../script/DOM.js';

import UiFile from '../../ui/file/ui-file.js';

import File from '../../../script/File.js';
import {updateChildrenAttribute} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'message-document');

const attributes = {
    color(root, value) { cssVariable(this, 'color', '#' + value); },
    timestamp(root, value) { updateChildrenHTML(root, 'span', value) }
  }
const properties = {}

export default class MessageDocument extends Component {
  constructor(data, time) {
    super(component);
    this.time = time;
    this.store(data);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const data = this.store();

    const div = $('div', node);
    const f = new UiFile({file: data, message: true});
    div.append(f);
    const span = document.createElement('span');
    span.innerText = this.time;
    div.append(span);
    return this;
  }

  static from(data, time) {
    const content = new MessageDocument(data, time);
    return content;
  }
}

Component.init(MessageDocument, component, {attributes, properties});
