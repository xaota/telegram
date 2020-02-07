import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-list');
const attributes = {

  }

const properties = {

  }

export default class UIList extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UIList, component, {attributes, properties});
