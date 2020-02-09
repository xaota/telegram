import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-close');
const attributes = {

  }

const properties = {

  }

export default class IconClose extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconClose, component, {attributes, properties});
