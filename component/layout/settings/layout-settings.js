import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIItem   from '../../ui/item/ui-item.js';
import UIIcon   from '../../ui/icon/ui-icon.js';
import UIHeader from '../../ui/header/ui-header.js';
import UIAvatar from '../../ui/avatar/ui-avatar.js';

const component = Component.meta(import.meta.url, 'layout-settings');
const attributes = {

  }

const properties = {

  }

export default class LayoutSettings extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const main = $('main', node);
    [...main.querySelectorAll('ui-item')]
      .forEach(e => e.addEventListener('click', _ => route(e.dataset.route)));
    return this;
  }
}

Component.init(LayoutSettings, component, {attributes, properties});

/** */
  function route(route = '') {
    if (!route) return;
    route.startsWith('//')
      ? window.open(route)
      : channel.send('route-aside', {route});
  }
