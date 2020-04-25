import Component, {html, css} from '../../script/ui/Component.js';
import {loadDialogs} from '../../state/dialogs/index.js';
import $ from '../../script/ui/DOM.js';
import {getDialogWithLastMessage} from '../../state/dialogs/helpers.js';
// import locator from '../../script/app/locator.js';

/* eslint-disable */
import UIFAB           from '../ui/fab.js';
import UIMenu          from '../ui/menu.js';
import UIDrop          from '../ui/drop.js';
import UIItem          from '../ui/item.js';
import UIList          from '../ui/list.js';
import UINetwork       from '../ui/network.js';
import AppConversation from '../app/conversation.js';
/* eslint-enable */
const {fromEvent} = rxjs;
const {map, distinctUntilChanged, withLatestFrom} = rxjs.operators;
const {construct, isObjectOf} = zagram;

const getDialogsOrder = R.pathOr([], ['dialogs', 'dialogsOrder']);

const getInputPeer = R.cond([
  [R.equals(undefined), R.always(construct('inputPeerSelf'))],
  [isObjectOf('peerChat'), R.partial(construct, ['inputPeerChat'])],
  [isObjectOf('peerUser'), R.partial(construct, ['inputPeerUser'])],
  [isObjectOf('peerChannel'), R.partial(construct, ['inputPeerChannel'])],
  [R.T, R.always(construct('inputPeerSelf'))]
]);

const style = css`
  :host {
    display: flex;
    /* font-size: 15px; */
    height: 100%;
    flex-direction: column;
  }

  /* ui-list {} */

  app-conversation[pin] + app-conversation:not([pin]) {
    position: relative;
    margin-top: 3px;
  }

  app-conversation[pin] + app-conversation:not([pin]):before {
    border-top: 1px solid var(--edge);
    display: block;
    content: '';
    position: absolute;
    top: -3px;
    left: 0;
    right: 0;
  }

  ui-drop {
    position: absolute;
    /* bottom: -54px; */
    bottom: 20px;
    right: 20px;
    transition: .3s ease bottom;
  }
  
  /* ui-list:hover ~ ui-drop, ui-drop:hover {
    bottom: 20px;
  } */

  /* :host-context(aside[collapsed]) ui-drop {
    right: auto;
    left: 16px;
  } */`;

const attributes = {};
const properties = {};

/** {ScreenConversations} @class
  * @description Отображение экрана списка чатов
  */
  export default class ScreenConversations extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-network updating></ui-network>
        <ui-tabs>
          <ui-tab selected>All chats</ui-tab>
          <ui-tab>Unread</ui-tab>
          <ui-tab>Personal</ui-tab>
          <ui-tab>Groups</ui-tab>
          <!-- <ui-tab>Channels</ui-tab>
          <ui-tab>Bots</ui-tab>
          <ui-tab>Other</ui-tab> -->
        </ui-tabs>
        <ui-list>
        </ui-list>
        <button>loadMore</button>
        <ui-drop up right>
          <ui-fab>edit</ui-fab>
          <ui-menu slot="drop">
            <ui-item icon="channel" id="fab-channel">New Channel</ui-item>
            <ui-item icon="group" id="fab-group">New Group</ui-item>
            <ui-item icon="private">New Private Chat</ui-item>
          </ui-menu>
        </ui-drop>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenConversations} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const uiList = $('ui-list', node);
      const loadMoreButton = $('button', node);

      const state$ = getState$();
      const dialogsOrderList$ = state$.pipe(
        map(getDialogsOrder),
        distinctUntilChanged()
      );

      dialogsOrderList$.subscribe(dialogs => {
        const localState = this.store();
        const newUiItems = {};
        for (let i = 0; i < dialogs.length; i++) {
          if (R.has(dialogs[i], localState)) {
            continue;
          }
          const appConversation = new AppConversation(dialogs[i]);
          uiList.append(appConversation);
          newUiItems[dialogs[i]] = appConversation;
        }
        this.store({...localState, ...newUiItems});
      });


    const loadMoreButtonClick$ = fromEvent(loadMoreButton, 'click');
    const latestDialog$ = dialogsOrderList$.pipe(
      map(R.pipe(R.last, R.partialRight(R.append, [['dialogs', 'dialogs']]))),
      withLatestFrom(state$),
      map(R.apply(R.path))
    );

    const loadMore$ = loadMoreButtonClick$.pipe(
      withLatestFrom(latestDialog$),
      map(R.nth(1)),
      map(getDialogWithLastMessage)
    );

    loadMore$.subscribe(x => {
      console.log('[LAST DIALOG]', x);
      loadDialogs({
        offset_id: R.propOr(0, 'top_message', x),
        offset_date: R.pathOr(0, ['last_message', 'date'], x),
        offset_peer: getInputPeer()
      });
    });

      loadDialogs();
      return this;
    }
  }

Component.init(ScreenConversations, 'screen-conversations', {attributes, properties});
