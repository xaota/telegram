import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import File from '../../../script/File.js';
import {storage} from '../../../tdweb/Telegram.js';

/* eslint-disable */
import UIItem   from '../../ui/item/ui-item.js';
import UIIcon   from '../../ui/icon/ui-icon.js';
import UIHeader from '../../ui/header/ui-header.js';
import UIAvatar from '../../ui/avatar/ui-avatar.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'layout-settings');
const attributes = {};
const properties = {};

export default class LayoutSettings extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const main = $('main', node);
    [...main.querySelectorAll('ui-item')]
      .forEach(e => e.addEventListener('click', _ => route(e.dataset.route)));

    const logout = $('#logout', node);
    logout.addEventListener('click', _ => {
      // отписать все события и воспроизведение чего-либо
      channel.send('user.loading');
      setTimeout(() => channel.send('user.logout'), 2000);
    });

    init(node);

    return this;
  }
}

Component.init(LayoutSettings, component, {attributes, properties});

/** */
  function init(node) {
    const me = storage.get('me');
    console.log(me);

    const h1 = $('h1', node);
    const h2 = $('h2', node);
    const avatar = $('ui-avatar', node);

    h1.innerText = '@' + me.username;
    h2.innerText = '+' + me.phone_number;
    avatar.color = UIAvatar.color(me.id);
    avatar.innerText = UIAvatar.letter(me.first_name + ' ' + me.last_name);
    if (me.profile_photo && me.profile_photo.small) File.getFile(me.profile_photo.small).then(src => avatar.src = src);
  }

/** */
  function route(route = '') {
    if (!route) return;
    route.startsWith('//')
      ? window.open(route)
      : channel.send('route-aside', {route});
  }
