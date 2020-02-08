import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'layout-settings');
const attributes = {

  }

const properties = {

  }

export default class LayoutSettings extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutSettings, component, {attributes, properties});
