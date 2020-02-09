import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenElement, updateChildrenProperty} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-input');
const attributes = {
    value(root, value) { updateChildrenElement(root, 'input', 'value', value) }
  }

const properties = {
    disabled(root, value) { updateChildrenProperty(root, 'input', 'disabled', value); }
  }

export default class UIInput extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const slot  = $('slot', node);
    const input = $('input', node);

    slot.addEventListener('slotchange', _ => updateChildrenAttribute(node, 'input', 'placeholder', this.innerText || this.innerHTML));
    input.addEventListener('input', _ => inputHandler.call(this, input, _));
    input.addEventListener('change', _ => this.event('change'));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') return this.event('enter') });
    this.addEventListener('focus', _ => input.focus());
    return this;
  }
}

Component.init(UIInput, component, {attributes, properties});

/** */
  function inputHandler(input, e) {
    e.stopPropagation();
    this.value = input.value;
    this.event('input');
  }
