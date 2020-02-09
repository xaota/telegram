import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

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
    $('.header__info', node)
        .addEventListener('click', () => {
          this.event('open-profile', {id: 1})
        });
    return this;
  }
}

Component.init(ConversationHeader, component, {attributes, properties});
