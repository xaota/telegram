import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'message-voice');
const attributes = {

  };

const properties = {

  };

export default class MessageVoice extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageVoice, component, {attributes, properties});
