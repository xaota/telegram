import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'layout-contacts');
const attributes = {

  };

const properties = {

  };

export default class LayoutContacts extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutContacts, component, {attributes, properties});
