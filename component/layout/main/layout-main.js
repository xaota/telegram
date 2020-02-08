import Component from '../../../script/Component.js';

import LayoutChat     from '../chats/layout-chats.js';
import LayoutSettings from '../settings/layout-settings.js';

import FormSettings from '../../form/settings/form-settings.js';
import FormPrivacy  from '../../form/privacy/form-privacy.js';
import FormNotifications from '../../form/notifications/form-notifications.js';

import LayoutEmpty        from '../empty/layout-empty.js';
import LayoutConversation from '../conversation/layout-conversation.js';

const component = Component.meta(import.meta.url, 'layout-main');
const attributes = {

  }

const properties = {

  }

export default class LayoutMain extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(LayoutMain, component, {attributes, properties});
