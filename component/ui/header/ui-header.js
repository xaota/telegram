import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

import IconMore from '../../icon/more/icon-more.js';
import IconBack from '../../icon/back/icon-back.js';

const component = Component.meta(import.meta.url, 'ui-header');
const attributes = {

  }

const properties = {

  }

export default class UIHeader extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const slot = $('slot[name="more"]', node);
    const more = $('icon-more', node);
    slot.addEventListener('slotchange', () => {
      more.style.display = slot.assignedNodes().length > 0
        ? 'flex'
        : ''; // none
    })
    return this;
  }
}

Component.init(UIHeader, component, {attributes, properties});
