import Component from '../../../script/Component.js';

import IconMenu      from '../../icon/menu/icon-menu.js';
import IconSearch    from '../../icon/search/icon-search.js';

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

    return this;
  }
}

Component.init(ChatsHeader, component, {attributes, properties});
