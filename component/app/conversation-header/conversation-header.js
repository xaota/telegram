import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import sidebarEvents from '../../layout/sidebar/events.js';

import UIAvatar from '../../ui/avatar/ui-avatar.js';
import '../../ui/icon/ui-icon.js';

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
    $('.left', node)
        .addEventListener('click', () => {
          channel.send(sidebarEvents.OPEN_PROFILE);
        });
    $('#search', node)
        .addEventListener('click', () => {
            channel.send(sidebarEvents.OPEN_SEARCH);
        });
    return this;
  }
}

Component.init(ConversationHeader, component, {attributes, properties});
