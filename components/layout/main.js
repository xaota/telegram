import Component, {html, css} from '../../script/ui/Component.js';
import $, {$$} from '../../script/ui/DOM.js';

import Router              from '../../script/ui/Router.js';
import locator             from '../../script/app/locator.js';

/* eslint-disable */
import AppHeader           from '../app/header.js';
import LayoutLoading       from './loading.js';
import LayoutSettings      from './settings.js';
import LayoutConversations from './conversations.js'; // список чатов
/* eslint-enable */

const style = css`
  :host {
    display: grid;
    grid-template-rows: 60px auto;
    position: relative;
  }`;

const attributes = {};
const properties = {};

/** {LayoutMain} @class
  * @description Главный экран приложения
  */
  export default class LayoutMain extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <!-- <app-header></app-header> -->
        <app-header>
          <ui-menu slot="menu">
            <ui-item icon="group" data-route="form-group">New group</ui-item>
            <ui-item icon="private">Contacts</ui-item>
            <ui-item icon="archive">Archived</ui-item>
            <ui-item icon="favorite" data-route="#favorite">Saved</ui-item>
            <ui-item icon="conversation" data-route="#conversation">Open by ID</ui-item>
            <ui-item icon="settings" data-action="router.main" data-detail='{"location":"layout-settings"}'>Settings</ui-item>
            <ui-item icon="help" data-route="//telegram.org/support">Help</ui-item>
            <ui-item icon="bulb" data-route="#night-mode">Night Mode</ui-item>
            <ui-item icon="back" data-route="#collapse">Collapse</ui-item>
            <ui-item data-route="layout-icons">Icons</ui-item>
          </ui-menu>
          Settings
          <ui-menu slot="more">
            <ui-item icon="exit" slot="more" id="logout">Log Out</ui-item>
          </ui-menu>
        </app-header>
        <main>
          <!--
          <layout-loading></layout-loading>
          <layout-conversations></layout-conversations>
          <layout-settings></layout-settings>
          -->
        </main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutMain} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      /** @type AppHeader */
      const header = $('app-header', node);
      const main   = $('main', node);

      const router = routing(main);
      locator.channel.on('router.main', ({location}) => router.check(location));
      locator.channel.on('header.main', ({options})  => header.store({options}));

      const items = $$('app-header ui-item[data-action]', node);
      items.forEach(item => { // меню
        item.addEventListener('click', () => {
          const action = item.dataset.action;
          const detail = JSON.parse(item.dataset.detail);
          locator.channel.send(action, detail);
        });
      });

      setTimeout(() => { // типа запросили список чатов
        locator.channel.send('router.main', {location: 'layout-conversations'});
      }, 1000);

      router.check();
      return this;
    }
  }

Component.init(LayoutMain, 'layout-main', {attributes, properties});

// #region [Private]
/** */
  function routing(root) {
    return new Router(root)
      .route({
        name: 'layout-conversations',
        check: Router.nameCheck
      })
      .route({
        name: 'layout-settings',
        check: Router.nameCheck
      })
      .route({
        name: 'layout-loading',
        default: true
      });
  }
// #endregion
