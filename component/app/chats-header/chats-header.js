import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIDrop from '../../ui/drop/ui-drop.js';
import UIItem from '../../ui/item/ui-item.js';
import UIIcon from '../../ui/icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'chats-header');
const attributes = {

  }

const properties = {

  }

export default class ChatsHeader extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const menu = $('#menu', node);
    const drop = $('ui-drop', node);
    menu.addEventListener('click', () => drop.show = !drop.show);
    [...drop.children]
      .filter(e => UIItem.is(e))
      .forEach(e => e.addEventListener('click', _ => route(drop, e.dataset.route)));
    return this;
  }
}

Component.init(ChatsHeader, component, {attributes, properties});

/** */
  function route(drop, route = '') {
    drop.show = false;
    if (!route) return;
    route.startsWith('//')
      ? window.open(route)
      : channel.send('route-aside', {route});
  }
