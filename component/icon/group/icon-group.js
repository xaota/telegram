import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-group');
const attributes = {

  }

const properties = {

  }

export default class IconGroup extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconGroup, component, {attributes, properties});
