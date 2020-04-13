import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UILoading           from '../ui/loading.js';
import AppHeader           from '../app/header.js';
import UIItem              from '../ui/item.js';
import ScreenSettings      from '../screen/settings.js';
import ScreenPreferences   from '../screen/preferences.js';
import ScreenNotifications from '../screen/notifications.js';
import ScreenSecurity      from '../screen/security.js';
import ScreenLanguage      from '../screen/language.js';
/* eslint-enable */

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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
        <app-header back="route-aside">
          Settings
          <ui-item icon="exit" slot="more" id="logout">Log Out</ui-item>
        </app-header>


        <screen-settings></screen-settings>
        <!--
          <screen-general></screen-general>
          <screen-preferences></screen-preferences>
          <screen-notifications></screen-notifications>
          <screen-security></screen-security>
          <screen-language></screen-language>
        -->
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutSettings} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(LayoutSettings, 'layout-settings', {attributes, properties});
