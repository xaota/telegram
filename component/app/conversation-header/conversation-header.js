import Component from '../../../script/Component.js';

import UIAvatar from '../../ui/avatar/ui-avatar.js';

const component = Component.meta(import.meta.url, 'conversation-header');
const attributes = {

  }

const properties = {

  }

export default class ConversationHeader extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(ConversationHeader, component, {attributes, properties});
