import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'message-file');
const attributes = {

  }

const properties = {

  }

export default class MessageFile extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageFile, component, {attributes, properties});
