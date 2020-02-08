import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'layout-empty');
const attributes = {

  }

const properties = {

  }

export default class LayoutEmpty extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutEmpty, component, {attributes, properties});
