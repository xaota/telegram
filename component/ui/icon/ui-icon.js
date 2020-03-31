import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-icon');
const attributes = {};
const properties = {};

export default class UIIcon extends Component {
  constructor(label) {
    super(component);
    if (label) this.innerText = label;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const slot = $('slot', node);
    const svg  = $('svg',  node);
    const icon = $('use',  svg);

    slot.addEventListener('slotchange', _ => {
      const name = this.innerText || this.innerHTML;
      if (!name) return icon.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
      const id = '#' + name;
      icon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', id);
      const g = $(id, svg);
      const viewBox = g.getAttribute('viewBox') || '0 0 24 24';
      svg.setAttribute('viewBox', viewBox);
    });

    return this;
  }
}

Component.init(UIIcon, component, {attributes, properties});
