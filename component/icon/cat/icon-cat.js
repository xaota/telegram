import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-cat');
const attributes = {

  }

const properties = {

  }

export default class IconCat extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconCat, component, {attributes, properties});
