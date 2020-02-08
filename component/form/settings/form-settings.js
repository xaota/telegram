import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-settings');
const attributes = {

  }

const properties = {

  }

export default class FormSettings extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormSettings, component, {attributes, properties});
