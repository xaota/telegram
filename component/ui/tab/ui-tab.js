import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-tab');
const attributes = {

  }

const properties = {

  }

export default class UITab extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UITab, component, {attributes, properties});
