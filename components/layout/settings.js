import Component, {html, css} from '../../script/ui/Component.js';

import Router              from '../../script/ui/Router.js';
import locator             from '../../script/app/locator.js';

/* eslint-disable */
import UIItem              from '../ui/item.js';
import ScreenSettings      from '../screen/settings.js';
import ScreenGeneral       from '../screen/general.js';
import ScreenPreferences   from '../screen/preferences.js';
import ScreenNotifications from '../screen/notifications.js';
import ScreenSecurity      from '../screen/security.js';
import ScreenLanguage      from '../screen/language.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    position: relative;
  }`;

const attributes = {};
const properties = {};

/** {LayoutSettings} @class
  * @description Отображение раздела настроек
  */
  export default class LayoutSettings extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <main>
        <!--
          <screen-settings></screen-settings>

          <screen-general></screen-general>
          <screen-preferences></screen-preferences>
          <screen-notifications></screen-notifications>
          <screen-security></screen-security>
          <screen-language></screen-language>
        -->
        </main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutSettings} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const router = routing(node.querySelector('main'));
      // const header = node.querySelector('app-header');
      // header.addEventListener('back', () => router.check());

      locator.channel.on('router.main.settings', ({location}) => router.check(location));
      router.check();
      return this;
    }
  }

Component.init(LayoutSettings, 'layout-settings', {attributes, properties});

// #region [Private]
/** routing */
function routing(root) {
  return new Router(root)
    .route({
      name: 'screen-general',
      check: Router.nameCheck
    })
    .route({
      name: 'screen-preferences',
      check: Router.nameCheck
    })
    .route({
      name: 'screen-notifications',
      check: Router.nameCheck
    })
    .route({
      name: 'screen-security',
      check: Router.nameCheck
    })
    .route({
      name: 'screen-language',
      check: Router.nameCheck
    })
    .route({
      name: 'screen-settings',
      default: true
    });
}
// #endregion
