import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-bulb');
const attributes = {

  }

const properties = {

  }

export default class IconBulb extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconBulb, component, {attributes, properties});
