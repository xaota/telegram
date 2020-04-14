import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'message-audio');
const attributes = {

  };

const properties = {

  };

export default class MessageAudio extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageAudio, component, {attributes, properties});
