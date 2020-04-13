import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIItem   from '../ui/item.js';
import UIAvatar from '../ui/avatar.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    padding: 0px 18px;
  }

  ui-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto 26px;
  }

  h1 {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 4px;
    font-weight: normal;
  }

  h2 {
    text-align: center;
    font-size: 14px;
    color: rgb(115, 120, 124);
    margin-bottom: 20px;
    font-weight: normal;
  }

  ui-item {
    border-radius: 8px;
  }

  ui-item ui-icon {
    color: #707579;
  }

  ui-item:hover ui-icon {
    color: #63A4EF;
  }`;

const attributes = {};
const properties = {};

/** {ScreenSettings} @class
  * @description Отображение экрана списка настроек
  */
  export default class ScreenSettings extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-avatar></ui-avatar>
        <h1></h1>
        <h2></h2>

        <div>
          <ui-item icon="edit" data-route="form-settings">Edit Profile</ui-item>
          <ui-item icon="settings" data-route="form-general">General Settings</ui-item>
          <ui-item icon="notifications" data-route="form-notifications">Notifications</ui-item>
          <ui-item icon="security" data-route="form-privacy">Privacy and Security</ui-item>
          <ui-item icon="language" data-route="form-language">Language</ui-item>
        </div>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenSettings} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      // const main = $('main', node);
      // [...main.querySelectorAll('ui-item')]
      //   .forEach(e => e.addEventListener('click', _ => route(e.dataset.route)));

      // const logout = $('#logout', node);
      // logout.addEventListener('click', _ => {
      //   // отписать все события и воспроизведение чего-либо
      //   channel.send('user.loading');
      //   setTimeout(() => channel.send('user.logout'), 2000);
      // });

      // init(node);

      return this;
    }
  }

Component.init(ScreenSettings, 'screen-settings', {attributes, properties});

// #region [Private]
/** */
  // function init(node) {
  //   const me = storage.get('me');
  //   console.log(me);

  //   const h1 = $('h1', node);
  //   const h2 = $('h2', node);
  //   const avatar = $('ui-avatar', node);

  //   h1.innerText = '@' + me.username;
  //   h2.innerText = '+' + me.phone_number;
  //   avatar.color = UIAvatar.color(me.id);
  //   avatar.innerText = UIAvatar.letter(me.first_name + ' ' + me.last_name);
  //   if (me.profile_photo && me.profile_photo.small) File.getFile(me.profile_photo.small).then(src => avatar.src = src);
  // }

/** */
  // function route(route = '') {
  //   if (!route) return;
  //   route.startsWith('//')
  //     ? window.open(route)
  //     : channel.send('route-aside', {route});
  // }
// #endregion
