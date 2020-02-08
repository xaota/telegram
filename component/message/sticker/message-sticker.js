import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'message-sticker');
const attributes = {

  }

const properties = {

  }

export default class MessageSticker extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageSticker, component, {attributes, properties});
