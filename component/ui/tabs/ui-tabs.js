import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-tabs');
const attributes = {

  };

const properties = {

  };

export default class UITabs extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UITabs, component, {attributes, properties});
