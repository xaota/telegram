import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-input');
const attributes = {

  }

const properties = {
    disabled(root, value) {
      updateChildrenAttribute(root, 'input', 'disabled', value);
    }
  }

export default class UIInput extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const slot = $('slot', node);

    slot.addEventListener('slotchange', () => {
      const text = this.innerText;
      updateChildrenAttribute(node, 'input', 'placeholder', text);
    });

    return this;
  }
}

Component.init(UIInput, component, {attributes, properties});
