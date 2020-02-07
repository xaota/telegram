import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-search');
const attributes = {

  }

const properties = {

  }

export default class IconSearch extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconSearch, component, {attributes, properties});
