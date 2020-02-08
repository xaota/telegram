import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-more');
const attributes = {

  }

const properties = {

  }

export default class IconMore extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconMore, component, {attributes, properties});
