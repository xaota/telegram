import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-car');
const attributes = {

  }

const properties = {

  }

export default class IconCar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconCar, component, {attributes, properties});
