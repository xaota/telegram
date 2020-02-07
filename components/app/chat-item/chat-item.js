import Component from '../../../script/Component.js';

import IconPin from '../../icon/pin/icon-pin.js';

const component = Component.meta(import.meta.url, 'chat-item');
const attributes = {

  }

const properties = {

  }

export default class ChatItem extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(ChatItem, component, {attributes, properties});
