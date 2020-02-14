import Component from '../../../script/Component.js';
import $, {updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-badge');
const attributes = {}
const properties = {}

export default class UIBadge extends Component {
  constructor() {
    super(component);
    this.store({value: 0});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const slot = $('slot', node);
    const span = $('span', node);
    slot.addEventListener('slotchange', _ => {
      const value = parseInt(this.innerText || this.innerHTML);
      const count = badge(value);
      this.store({value});
      span.innerText = count;
      span.style.display = value !== 0
        ? ''
        : 'none';
    });
    return this;
  }
}

Component.init(UIBadge, component, {attributes, properties});

function badge(count) {
  return count > 1e6
    ? Math.floor(count / 1e6) + 'M'
    : count > 1e3
      ? Math.floor(count / 1e3) + 'K'
      : count.toString();
}
