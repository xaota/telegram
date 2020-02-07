import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-country');
const attributes = {

  }

const properties = {

  }

export default class UICountry extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(attributes, properties);

    return this;
  }
}

Component.init(UICountry, component, {attributes, properties});
