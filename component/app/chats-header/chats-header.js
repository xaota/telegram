import Component from '../../../script/Component.js';
import $, {channel, nightTheme} from '../../../script/DOM.js';

import UIDrop from '../../ui/drop/ui-drop.js';
import UIItem from '../../ui/item/ui-item.js';
import UIIcon from '../../ui/icon/ui-icon.js';
import '../../form/search/form-search.js';

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
      : route.startsWith('#')
        ? action(route.slice(1))
        : channel.send('route-aside', {route})
  }

/** */
  function action(route) {
    console.log('action', route);
    switch (route) {
      case 'night-mode': return nightTheme();
    }
  }
