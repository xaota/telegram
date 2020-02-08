import Component from '../../../script/Component.js';

import UIItem   from '../../ui/item/ui-item.js';
import UIHeader from '../../ui/header/ui-header.js';
import UIAvatar from '../../ui/avatar/ui-avatar.js';

import IconExit          from '../../icon/exit/icon-exit.js';
import IconEdit          from '../../icon/edit/icon-edit.js';
import IconSecurity      from '../../icon/security/icon-security.js';
import IconSettings      from '../../icon/settings/icon-settings.js';
import IconLanguage      from '../../icon/language/icon-language.js';
import IconNotifications from '../../icon/notifications/icon-notifications.js';

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

    return this;
  }
}

Component.init(LayoutSettings, component, {attributes, properties});
