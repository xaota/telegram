import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-button');
const attributes = {

  }

const properties = {

  }

export default class UIButton extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(attributes, properties);

    return this;
  }
}

Component.init(UIButton, component, {attributes, properties});
