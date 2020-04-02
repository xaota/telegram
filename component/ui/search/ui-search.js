import Component from '../../../script/Component.js';
import $, {updateChildrenElement, updateChildrenProperty, updateChildrenAttribute} from '../../../script/DOM.js';
import {debounce} from '../../../script/helpers.js';

/* eslint-disable */
import UIIcon from '../../ui/icon/ui-icon.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'ui-search');
const attributes = {
    value(root, value) { updateChildrenElement(root, 'input', 'value', value); }
  };

const properties = {
    disabled(root, value) { updateChildrenProperty(root, 'input', 'disabled', value); }
  };

export default class UISearch extends Component {
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
    input.addEventListener('keydown', e => { if (e.key === 'Enter') return this.event('enter'); });
    this.addEventListener('focus', _ => input.focus());
    this.debounced = debounce(value => {
      this.event('ui-search', {value});
    }, 300);
    return this;
  }
}

Component.init(UISearch, component, {attributes, properties});

/** */
  function inputHandler(input, e) {
    e.stopPropagation();
    this.value = input.value;
    if (input.value.trim()) {
      input.value = input.value.startsWith('@') ? input.value.substr(1) : input.value;
      this.debounced(input.value);
    }
    this.event('input');
  }

