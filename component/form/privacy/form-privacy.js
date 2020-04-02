import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-privacy');
const attributes = {

  };

const properties = {

  };

export default class FormPrivacy extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormPrivacy, component, {attributes, properties});
