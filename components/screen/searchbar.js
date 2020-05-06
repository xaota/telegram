import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {closeSearchBar} from '../../state/ui/index.js';
import {
  searchDialogMessages,
  clearSearchedDialogs
} from '../../state/dialogs/actions.js';
import {
  getActiveDialogInputPeer$,
  getActiveDialogSearchedMessages$,
  getActiveDialogId$,
  getLastSearchedMessageId$
} from '../../state/dialogs/stream-builders.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {peerIdToPeer} from '../../state/utils.js';

/* eslint-disable */
import UITab      from '../ui/tab.js';
import UITabs     from '../ui/tabs.js';
import UIIcon     from '../ui/icon.js'
import PeerAvatar from '../ui/peer-avatar.js'
import IUProperty from '../ui/property.js';
import AppHeader  from '../app/header.js';
import MediaFileList from '../app/media-file-list.js'
import DocumentFileList from '../app/document-file-list.js'
import UISearch from '../ui/search.js';
import SearchedPreview from '../app/searched-preview.js'
/* eslint-enable */

const {fromEvent} = rxjs;
const {map, withLatestFrom, distinctUntilChanged, startWith} = rxjs.operators;

const style = css`
  :host {
    color:      var(--foreground);
    background: var(--background-aside);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100wh;
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
  .header-place {
    display: flex;
    flex-direction: row;
  }
`;

const attributes = {};
const properties = {};

/** {ScreenSidebar} @class
 * @description Отображение раздела беседы
 */
export default class ScreenSearchbar extends Component {
  static template = html`
      <template>
        <style>${style}</style>
        <div class="header-place">
            <app-header close>
                <ui-search slot="data"></ui-search>
            </app-header>
        </div>
        <ui-list></ui-list>
      </template>`

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
   * @param {ShadowRoot} node корневой узел элемента
   * @return {Component} @this {ScreenSidebar} текущий компонент
   */
  mount(node) {
    super.mount(node, attributes, properties);
    const searchResultsPlaceNode = $('ui-list', node);
    const appHeaderNode = $('app-header', node);
    const close$ = fromEvent(appHeaderNode, 'close');
    close$.subscribe(closeSearchBar);

    const uiSearchNode = $('ui-search', node);
    const searchEnter$ = fromEvent(uiSearchNode, 'enter');
    const searchValue$ = searchEnter$.pipe(map(R.path(['detail', 'value'])));

    const state$ = getState$();
    const activeDialogPeer$ = getActiveDialogId$(state$).pipe(
      distinctUntilChanged(),
      map(peerIdToPeer)
    );
    const activeDialogInputPeer$ = getActiveDialogInputPeer$(state$);

    const clearSearch$ = searchEnter$.pipe(
      startWith(null),
      withLatestFrom(activeDialogPeer$),
      map(R.nth(1))
    );
    clearSearch$.subscribe(dialogPeer => {
      clearSearchedDialogs(dialogPeer);
      searchResultsPlaceNode.innerHTML = '';
      this.store({renderedMessages: {}});
    });

    const searchStart$ = searchValue$.pipe(
      map(wrapAsObjWithKey('q')),
      withLatestFrom(activeDialogInputPeer$.pipe(map(wrapAsObjWithKey('peer')))),
      map(R.mergeAll)
    );

    searchStart$.subscribe(searchDialogMessages);

    const searchedMessages$ = getActiveDialogSearchedMessages$(state$);
    searchedMessages$.subscribe(searchedMessages => {
      const {renderedMessages} = this.store();
      const newRenderedMessages = {};

      for (let i = 0; i < searchedMessages.length; i++) {
        const message = searchedMessages[i];
        if (renderedMessages[message.id]) {
          continue;
        }
        const searchedPreview = new SearchedPreview(message);
        searchResultsPlaceNode.appendChild(searchedPreview);

        newRenderedMessages[message.id] = true;
      }

      this.store({renderedMessages: {...renderedMessages, ...newRenderedMessages}});
    });

    const lastSearchMessageId$ = getLastSearchedMessageId$(state$);
    const loadMoreEvent$ = fromEvent(searchResultsPlaceNode, 'load-more');
    const loadMore$ = loadMoreEvent$.pipe(
      withLatestFrom(searchStart$),
      map(R.nth(1)),
      withLatestFrom(lastSearchMessageId$.pipe(map(wrapAsObjWithKey('offset_id')))),
      map(R.mergeAll)
    );

    loadMore$.subscribe(searchDialogMessages);
    return this;
  }
}

Component.init(ScreenSearchbar, 'screen-searchbar', {attributes, properties});
