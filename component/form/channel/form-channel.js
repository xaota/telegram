import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-channel');
const attributes = {

  }

const properties = {

  }

export default class FormChannel extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormChannel, component, {attributes, properties});
