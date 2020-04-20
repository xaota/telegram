import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UITab      from '../ui/tab.js';
import UITabs     from '../ui/tabs.js';
import UIIcon     from '../ui/icon.js'
import UIAvatar   from '../ui/avatar.js';
import IUProperty from '../ui/property.js';
import AppHeader  from '../app/header.js';
/* eslint-enable */

const style = css`
  :host {
    color:      var(--foreground);
    background: var(--background-aside);
  }
  main {
    text-align: center;
  }
  ui-avatar {
    width: 120px;
    height: 120px;
    margin: 24px auto;
  }
  ui-icon:hover {
    color: var(--iconStatic);
  }
  h1 {
    font-weight: 500;
    font-size: 24px;
    max-width: 80%;
    margin: 0 auto;
  }
  h2 {
    color: #707579;
    font-size: 14px;
    font-weight: normal;
  }
  ui-online {
    margin-top: 5px;
  }
  ui-property {
    margin: 0 18px 32px;
  }
  ui-tabs {
    position: sticky;
    top: -3px;
    /* z-index: 100;
    background: var(--background-aside); */
  }`;

const attributes = {};
const properties = {};

/** {ScreenSidebar} @class
  * @description Отображение раздела беседы
  */
  export default class ScreenSidebar extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-header close more></app-header>
        <main>
          <ui-avatar></ui-avatar>
          <h1>хаотаскрипт</h1>
          <ui-online></ui-online>
          <h2>34 members</h2>
        </main>

        <ui-property icon="info" caption="About" side="left" large>https://github.com/xaotascript

          Союз нерушимый █ █ █ █ токсичных
          Сплотил нам навеки великий фронтенд
          Да здравствует созданный волей ДАННЫЕ_УДАЛЕНЫ
          Единый могучий хаотаскрипт!

          https://t.me/addstickers/gwifmkosc_1001282550938_by_QuotLyBot</ui-property>
        <ui-property icon="username" caption="Link" side="left" large>https://t.me/joinchat/fdghjklkjhfggiolllljl</ui-property>

        <ui-tabs>
          <ui-tab id="media" selected>Media</ui-tab>
          <ui-tab id="docs">Docs</ui-tab>
          <ui-tab id="links">Links</ui-tab>
          <ui-tab id="audio">Audio</ui-tab>
        </ui-tabs>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenSidebar} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenSidebar, 'screen-sidebar', {attributes, properties});
