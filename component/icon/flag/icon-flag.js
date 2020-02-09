import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-flag');
const attributes = {

  }

const properties = {

  }

export default class IconFlag extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconFlag, component, {attributes, properties});
