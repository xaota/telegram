import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-private');
const attributes = {

  }

const properties = {

  }

export default class IconPrivate extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconPrivate, component, {attributes, properties});
