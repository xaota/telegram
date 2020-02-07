import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'conversation-input');
const attributes = {

  }

const properties = {

  }

export default class ConversationInput extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(ConversationInput, component, {attributes, properties});
