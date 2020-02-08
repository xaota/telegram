import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-check');
const attributes = {

  }

const properties = {

  }

export default class IconCheck extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconCheck, component, {attributes, properties});
