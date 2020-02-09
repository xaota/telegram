import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import LayoutChat from '../chats/layout-chats.js';

import FormGroup from '../../form/group/form-group.js';

import LayoutSettings from '../settings/layout-settings.js';
import FormGeneral  from '../../form/general/form-general.js';
import FormPrivacy  from '../../form/privacy/form-privacy.js';
import FormSettings from '../../form/settings/form-settings.js';
import FormLanguage from '../../form/language/form-language.js';
import FormNotifications from '../../form/notifications/form-notifications.js';

import LayoutEmpty        from '../empty/layout-empty.js';
import LayoutConversation from '../conversation/layout-conversation.js';

import LayoutIcons from '../icons/layout-icons.js';

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
    const aside = $('aside', node);
    this.store({
      aside: {
        path: [],
        root: aside,
        href: 'layout-chats'
      }
    });

    route.call(this, 'aside');
    channel.on('route-aside', e => route.call(this, 'aside', e.route));
    return this;
  }
}

Component.init(LayoutMain, component, {attributes, properties});

/** */
  function route(root, route) {
    const store = this.store()[root];
    const {path, root: node, href} = store;

    if (!route) {
      path.pop(); //
      route = path.pop() || href;
    }

    const target = $(route, node);
    if (!target) return console.error('route not found:', root, route);
    [...node.children].forEach(e => e.style.display = 'none');
    target.style.display = '';

    path.push(route);
    store.path = path;
    this.store({[root]: store});
    console.log('store', this.store()[root].path);
  }
