import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

import UIDrop from '../../ui/drop/ui-drop.js';
import UIItem from '../../ui/item/ui-item.js';

import IconMenu     from '../../icon/menu/icon-menu.js';
import IconSearch   from '../../icon/search/icon-search.js';

import IconHelp     from '../../icon/help/icon-help.js';
import IconGroup    from '../../icon/group/icon-group.js';
import IconPrivate  from '../../icon/private/icon-private.js';
import IconArchive  from '../../icon/archive/icon-archive.js';
import IconFavorite from '../../icon/favorite/icon-favorite.js';
import IconSettings from '../../icon/settings/icon-settings.js';

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
    const menu = $('icon-menu', node);
    const drop = $('ui-drop', node);
    menu.addEventListener('click', () => drop.show = !drop.show);
    return this;
  }
}

Component.init(ChatsHeader, component, {attributes, properties});
