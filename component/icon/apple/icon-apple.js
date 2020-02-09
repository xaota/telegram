import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-apple');
const attributes = {

  }

const properties = {

  }

export default class IconApple extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconApple, component, {attributes, properties});
