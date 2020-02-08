import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-fab');
const attributes = {

  }

const properties = {

  }

export default class UIFAB extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UIFAB, component, {attributes, properties});
