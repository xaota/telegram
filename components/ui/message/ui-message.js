import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-message');
const attributes = {

  }

const properties = {

  }

export default class UIMessage extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UIMessage, component, {attributes, properties});
