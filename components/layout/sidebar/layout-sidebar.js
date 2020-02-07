import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'layout-sidebar');
const attributes = {

  }

const properties = {

  }

export default class LayoutSidebar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutSidebar, component, {attributes, properties});
