import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

/* eslint-disable */
import UIIcon from '../icon/ui-icon.js';
import UIDrop from '../drop/ui-drop.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'ui-header');
const attributes = {

  };

const properties = {

  };

export default class UIHeader extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const slot = $('slot[name="more"]', node);
    const more = $('#more', node);
    const drop = $('ui-drop', node);

    slot.addEventListener('slotchange', () => {
      more.style.display = slot.assignedNodes().length > 0
        ? 'flex'
        : ''; // none
    });
    more.addEventListener('click', () => drop.show = !drop.show);

    const back = $('#back', node);
    back.addEventListener('click', _ => route(this.getAttribute('back'), drop));

    return this;
  }
}

Component.init(UIHeader, component, {attributes, properties});

/** */
  function route(layout, drop) {
    channel.send(layout);
    drop.show = false;
  }
