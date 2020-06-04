import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogId$,
  getPeerCommonInfoOfActiveDialog$
} from '../../state/dialogs/stream-builders.js';
/* eslint-disable */
import {
  getAboutFromPeerInfo,
  getInviteLinkFromPeerInfo,
  getMembersCountFromPeerInfo,
  getPhoneFromPeerInfo,
  getTitleFromPeerInfo,
  getUsernameFromPeerInfo
} from '../../state/dialogs/helpers.js'
import { closeSideBar } from '../../state/ui/index.js'
/* eslint-disable */
import PeerAvatar from '../ui/peer-avatar.js'
import MediaFileList from '../app/media-file-list.js'
import DocumentFileList from '../app/document-file-list.js'
import {tabsSelector} from '../../script/ui/tabSelector.js'

const {fromEvent} = rxjs;
const {distinctUntilChanged} = rxjs.operators;

/* eslint-enable */

const style = css`
  :host {
    color:      var(--foreground);
    background: var(--background-aside);
    flex-grow: 1;
    height: 100wh;
    display: flex;
    flex-direction: column;
  }
  main {
    text-align: center;
  }
  .peer-avatar-place {
    width: 120px;
    height: 120px;
    margin: 24px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
  }
  
  .tab-content {
    display: flex; 
    flex-direction: column;
    flex-grow: 1;
  }
  
  .header-place {
    display: flex;
    flex-direction: row;
  }
  `;

const attributes = {};
const properties = {};

function switchNode(node, value) {
  if (!value) {
    node.style.display = 'none';
  } else {
    node.innerText = value;
    node.style.display = 'block';
  }
}

/**
 * @param {HTMLElement} - node for text value
 * @param {Function} - function that takes peerInfo and returns string
 * @param {*} - peerInfo object
 */
const switchWithPeer = R.nAry(3, R.unapply(R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(
      R.of,
      R.ap([R.nth(1), R.nth(2)]),
      R.apply(R.call)
    )
  ]),
  R.apply(switchNode)
)));

const buildSwitcher = R.pipe(
  R.map(R.partial(switchWithPeer)),
  R.ap,
  R.curry(R.binary(R.pipe))(R.of)
);

/** {ScreenSidebar} @class
 * @description Отображение раздела беседы
 */
export default class ScreenSidebar extends Component {
  static template = html`
      <template>
        <style>${style}</style>
        <div class="header-place">
            <app-header close more></app-header>
        </div>
        <main>
          <div class="peer-avatar-place"></div>
          <h1 id="title"></h1>
          <h2 id="members"></h2>
        </main>

        <ui-property id="username" icon="username" caption="Username" side="left" large></ui-property>
        <ui-property id="about" icon="info" caption="About" side="left" large></ui-property>
        <ui-property id="phone" icon="phone" caption="phone" side="left" large></ui-property>
        <ui-property id="invite_link" icon="username" caption="Link" side="left" large></ui-property>

        <ui-tabs>
          <ui-tab id="media" selected>Media</ui-tab>
          <ui-tab id="docs">Docs</ui-tab>
          <ui-tab id="links">Links</ui-tab>
          <ui-tab id="audio">Audio</ui-tab>
        </ui-tabs>
        <div class="tab-content">
        </div>
      </template>`

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
   * @param {ShadowRoot} node корневой узел элемента
   * @return {Component} @this {ScreenSidebar} текущий компонент
   */
  mount(node) {
    super.mount(node, attributes, properties);
    const state$ = getState$();

    getPeerCommonInfoOfActiveDialog$(state$).subscribe(peerInfo => {
      this.store({peerInfo});
    });

    const activeDialogId$ = getActiveDialogId$(state$);

    const peerAvatarPlaceNode = $('.peer-avatar-place', node);
    activeDialogId$.pipe(distinctUntilChanged()).subscribe(dialogId => {
      if (dialogId) {
        peerAvatarPlaceNode.innerHTML = '';
        const peerAvatar = new PeerAvatar(dialogId);
        peerAvatarPlaceNode.appendChild(peerAvatar);
      }
    });

    const appHeaderNode = $('app-header', node);
    const close$ = fromEvent(appHeaderNode, 'close');
    close$.subscribe(closeSideBar);

    const uiTabsNode = $('ui-tabs', node);
    const uiTabContentNode = $('.tab-content', node);
    tabsSelector(uiTabsNode, ['#media', '#docs', '#links', '#audio'], '#media')
      .subscribe(x => {
        uiTabContentNode.innerHTML = '';
        if (x === '#media') {
          const mediaFileList = new MediaFileList();
          uiTabContentNode.appendChild(mediaFileList);
        }
        if (x === '#docs') {
          const docsFileList = new DocumentFileList();
          uiTabContentNode.appendChild(docsFileList);
        }
      });

    return this;
  }

  render(node) {
    const {peerInfo} = this.store();
    const titleNode = $('#title', node);
    const usernameNode = $('#username', node);
    const membersNode = $('#members', node);
    const aboutNode = $('#about', node);
    const inviteLinkNode = $('#invite_link', node);
    const phoneNode = $('#phone', node);

    if (R.isNil(peerInfo)) {
      return this;
    }

    const switchByPeerInfo = buildSwitcher([
      [titleNode, getTitleFromPeerInfo],
      [usernameNode, getUsernameFromPeerInfo],
      [membersNode, getMembersCountFromPeerInfo],
      [aboutNode, getAboutFromPeerInfo],
      [inviteLinkNode, getInviteLinkFromPeerInfo],
      [phoneNode, getPhoneFromPeerInfo]
    ]);

    switchByPeerInfo(peerInfo);

    return this;
  }
}

Component.init(ScreenSidebar, 'screen-sidebar', {attributes, properties});
