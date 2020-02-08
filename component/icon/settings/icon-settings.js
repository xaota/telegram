import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-settings');
const attributes = {

  }

const properties = {

  }

export default class IconSettings extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconSettings, component, {attributes, properties});
