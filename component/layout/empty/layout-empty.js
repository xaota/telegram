import Component from '../../../script/Component.js';

import IconGroup        from '../../icon/group/icon-group.js';
import IconPrivate      from '../../icon/private/icon-private.js';
import IconChannel      from '../../icon/channel/icon-channel.js';
import IconConversation from '../../icon/conversation/icon-conversation.js';

const component = Component.meta(import.meta.url, 'layout-empty');
const attributes = {

  }

const properties = {

  }

export default class LayoutEmpty extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutEmpty, component, {attributes, properties});
