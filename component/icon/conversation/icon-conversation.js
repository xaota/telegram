import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-conversation');
const attributes = {

  }

const properties = {

  }

export default class IconConversation extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconConversation, component, {attributes, properties});
