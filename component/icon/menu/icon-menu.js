import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-menu');
const attributes = {

  }

const properties = {

  }

export default class IconMenu extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconMenu, component, {attributes, properties});
