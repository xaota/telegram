import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getPeerCommonInfoOfActiveDialog$} from '../../state/dialogs/stream-builders.js';
import {getTitle} from '../../state/dialogs/helpers.js';

/* eslint-disable */
import UITab      from '../ui/tab.js';
import UITabs     from '../ui/tabs.js';
import UIIcon     from '../ui/icon.js'
import UIAvatar   from '../ui/avatar.js';
import IUProperty from '../ui/property.js';
import AppHeader  from '../app/header.js';
/* eslint-enable */

const {isObjectOf} = zagram;

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
          <ui-avatar id="avatar"></ui-avatar>
          <h1 id="title"></h1>
          <h2 id="members"></h2>
        </main>

        <ui-property id="about" icon="info" caption="About" side="left" large></ui-property>
        <ui-property id="invite_link" icon="username" caption="Link" side="left" large></ui-property>

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
      super.mount(node, attributes, properties);
      const state$ = getState$()
      getPeerCommonInfoOfActiveDialog$(state$).subscribe(peerInfo => {
        this.store({peerInfo});
      });
      return this;
    }

    render(node) {
      const {peerInfo} = this.store();
      const titleNode = $('#title', node);
      const membersNode = $('#members', node);
      const avatarNode = $('#avatar', node);
      const aboutNode = $("#about", node);
      const inviteLink = $("#invite_link", node);

      if (R.isNil(peerInfo)) {
        return this;
      }

      const chaption = getTitle(peerInfo.base);

      titleNode.innerText = chaption;

      if (isObjectOf('channelFull', R.propOr({}, 'full', peerInfo))) {
        const membersCount = R.pathOr(0, ['full', 'participants_count'], peerInfo);
        const onlineCount = R.pathOr(0, ['full', 'online_count'], peerInfo);
        membersNode.innerText = `members: ${membersCount} online: ${onlineCount}`;
      } else {
        membersNode.innerText = '';
      }

      avatarNode.color = UIAvatar.color(R.pathOr(0, ['base', 'id'], peerInfo));
      avatarNode.innerText = UIAvatar.letter(chaption);

      aboutNode.innerText = R.pathOr("", ['full', 'about'], peerInfo);
      inviteLink.innerText = R.pathOr("", ['full', 'exported_invite', 'link'], peerInfo);

      return this;
    }
  }

Component.init(ScreenSidebar, 'screen-sidebar', {attributes, properties});
