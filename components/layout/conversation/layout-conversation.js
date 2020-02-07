import Component from '../../../script/Component.js';

import UIList             from '../../ui/list/ui-list.js';
import LayoutLoading      from '../loading/layout-loading.js';
import ConversationInput  from '../../app/conversation-input/conversation-input.js';
import ConversationHeader from '../../app/conversation-header/conversation-header.js';

const component = Component.meta(import.meta.url, 'layout-conversation');
const attributes = {

  }

const properties = {

  }

export default class LayoutConversation extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutConversation, component, {attributes, properties});
