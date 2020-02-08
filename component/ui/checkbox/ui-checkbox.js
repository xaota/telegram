import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-checkbox');
const properties = {
    checked(root, value) { console.log('check') }
  }

export default class UICheckbox extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount({}, properties);

    return this;
  }
}

Component.init(UICheckbox, component, {properties});
