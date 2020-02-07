import Component from '../../../script/Component.js';

import UIList        from '../../ui/list/ui-list.js';
import UIAvatar      from '../../ui/avatar/ui-avatar.js';
import ChatItem      from '../../app/chat-item/chat-item.js';
import ChatsHeader   from '../../app/chats-header/chats-header.js';
import LayoutLoading from '../loading/layout-loading.js';

const component = Component.meta(import.meta.url, 'layout-chats');
const attributes = {

  }

const properties = {

  }

export default class LayoutChats extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutChats, component, {attributes, properties});
