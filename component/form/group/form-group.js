import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-group');
const attributes = {

  }

const properties = {

  }

export default class FromGroup extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FromGroup, component, {attributes, properties});
