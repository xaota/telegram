import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-attach');
const attributes = {

  }

const properties = {

  }

export default class IconAttach extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconAttach, component, {attributes, properties});
