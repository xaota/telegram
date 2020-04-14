import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import LayoutChats from '../chats/layout-chats.js';

/* eslint-disable */
import FormGroup from '../../form/group/form-group.js';
import FormChannel from '../../form/channel/form-channel.js';

import LayoutSettings from '../settings/layout-settings.js';
import FormGeneral  from '../../form/general/form-general.js';
import FormPrivacy  from '../../form/privacy/form-privacy.js';
import FormSettings from '../../form/settings/form-settings.js';
import FormLanguage from '../../form/language/form-language.js';
import FormNotifications from '../../form/notifications/form-notifications.js';

import LayoutEmpty        from '../empty/layout-empty.js';
import LayoutConversation from '../conversation/layout-conversation.js';

import LayoutIcons from '../icons/layout-icons.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'layout-main');
const attributes = {

  };

const properties = {

  };

export default class LayoutMain extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const aside = $('aside', node);
    const main  = $('main', node);

    this.store({
      aside: {
        path: [],
        root: aside,
        href: 'layout-chats',
        base: LayoutChats
      }
    });


    channel.on('route-aside', e => route.call(this, 'aside', e.route));
    channel.on('aside-collapse', e => aside.hasAttribute('collapsed') ? aside.removeAttribute('collapsed') : aside.setAttribute('collapsed', ''));

    channel.on('conversation.open', e => {
      // console.log(e.id)
      const temp = $('layout-conversation, layout-empty', main);
      if (temp) temp.remove();
      // loader?
      const conversation = new LayoutConversation(e);
      main.append(conversation);
    });

    route.call(this, 'aside'); // let current =
    return this;
  }
}

Component.init(LayoutMain, component, {attributes, properties});

/** */
  function route(root, route) {
    const store = this.store()[root];
    const {path, root: node, href, base} = store;

    if (!route) {
      path.pop(); //
      route = path.pop() || href;
    }

    node.removeAttribute('collapsed'); // todo: if node === aside
    let target = $(route, node);
    if (!target) {
      if (!base) return console.error('route not found:', root, route);
      target = new base();
      node.append(target);
    }

    [...node.children].forEach(e => e.style.display = 'none');
    target.style.display = '';

    path.push(route);
    store.path = path;
    this.store({[root]: store});
    // console.log(root, 'route', this.store()[root].path);
    return target;
  }
