import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

import UIIcon from '../icon/ui-icon.js';

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
    const slot = $('slot', node);
    const icon = $('ui-icon', node);
    slot.addEventListener('slotchange', _ => icon.innerText = this.innerText);
    return this;
  }
}

Component.init(UIFAB, component, {attributes, properties});
