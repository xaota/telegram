import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-back');
const attributes = {

  }

const properties = {

  }

export default class IconBack extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconBack, component, {attributes, properties});
