import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogInfo$,
  getActiveDialogId$,
  getActiveDialogMessages$,
  getNextHistoryLoader$
} from '../../state/dialogs/stream-builders.js';
import {loadDialogHistory} from '../../state/dialogs/actions.js';
import {closeSideBar, openSearchBar, closeSearchBar} from '../../state/ui/index.js';

/* eslint-disable */
import AppHeader   from '../app/header.js';
import ScreenField from '../screen/field.js';
import DialogHeader from '../app/dialog-header.js';
import PeerAvatar from '../ui/peer-avatar.js'
/* eslint-enable */

import AppMessageGroup  from '../app/message-group.js';

const {fromEvent, Observable} = rxjs;
const {map, distinctUntilChanged, withLatestFrom} = rxjs.operators;

const getMessageGroupId = R.pipe(
  R.map(R.pipe(R.prop('id'), R.toString)),
  R.join('_')
);


function intersectionObserver$(observeNode, containerNode) {
  return new Observable(subscriber => {
    const intersectionObserverOptions = {
      root: containerNode,
      rootMargin: '0px',
      threshold: 0.01
    };
    const observer = new IntersectionObserver(
      x => subscriber.next(x),
      intersectionObserverOptions
    );
    observer.observe(observeNode);
  });
}

const style = css`
  :host {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header-area {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
  }

  .message-area {
    overflow-y: auto;
    height: 0px;
    justify-content: flex-end;
    flex-grow: 1;
  }

  .message-area-inner {
    display: flex;
    flex-direction: column-reverse;
    min-height: 100%;
    justify-content: flex-end;
  }

  .send-message-area {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
    flex-grow: 0;
  }
  
  .load-more {
    flex-shrink: 0;
    height: 40px;
    width: 100%;
    background: #ff0000;
    opacity: 0;
  }
`;
const attributes = {};
const properties = {};
/** {ScreenConversation} @class
  * @description Отображение раздела беседы
  */
export default class ScreenConversation extends Component {
  static template = html`
      <template>
        <style>${style}</style>
          <div class="header-area"> <!-- зачем обертка? -->
            <app-header find more>
              <dialog-header slot="data"></dialog-header>
            </app-header>
          </div>


        <div class="message-area">
          <div class="load-more"></div>
          <div class="message-area-inner">

          </div>
        </div>

        <div class="send-message-area">
          <screen-field></screen-field>
        </div>
      </template>
  `;

  constructor() {
    super();
    this.renderedNodes = {};
  }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenConversation} текущий компонент
    */
  mount(node) {
    const state$ = getState$();
    const activeDialog$ = getActiveDialogInfo$(state$);
    const activeDialogId$ = getActiveDialogId$(state$);
    const msgAreaInnerNode = $('.message-area', node);

    activeDialogId$.pipe(distinctUntilChanged()).subscribe(() => {
      closeSearchBar();
      closeSideBar();
      msgAreaInnerNode.scrollTop = msgAreaInnerNode.scrollHeight - msgAreaInnerNode.clientHeight;
    });

    activeDialog$.subscribe(dialog => {
      this.store({dialog});
    });

    const dialogMessages$ = getActiveDialogMessages$(state$)
      .pipe(map(R.groupWith(R.eqProps('from_id'))));

    dialogMessages$.subscribe(groupedMessages => {
      this.store({groupedMessages});
    });


    const nextHistoryLoader$ = getNextHistoryLoader$(state$);

    const loadMoreNode = $('.load-more', node);
    const messageAreaNode = $('.message-area', node);
    const loadMoreEvent$ = intersectionObserver$(loadMoreNode, messageAreaNode);

    const loadMore$ = loadMoreEvent$.pipe(
      withLatestFrom(nextHistoryLoader$),
      map(R.nth(1))
    );

    loadMore$.subscribe(loadDialogHistory);

    const appHeaderNode = $('app-header', node);
    const searchClick$ = fromEvent(appHeaderNode, 'find');

    searchClick$.subscribe(() => {
      closeSideBar();
      openSearchBar();
    });
    return super.mount(node, attributes, properties);
  }

  render(node) {
    const {dialog, groupedMessages = []} = this.store();
    if (R.isNil(dialog)) {
      return this;
    }

    const messageAreaNode = $('.message-area-inner', node);
    const newRenderedNodes = {};
    for (let i = 0; i < groupedMessages.length; i++) {
      const messageGroup = groupedMessages[i];
      const messageGroupId = getMessageGroupId(messageGroup);
      if (R.has(messageGroupId, this.renderedNodes)) {
        newRenderedNodes[messageGroupId] = this.renderedNodes[messageGroupId];
      } else {
        const messageGroup = groupedMessages[i];
        const appMessageGroup = new AppMessageGroup(messageGroup);
        messageAreaNode.appendChild(appMessageGroup);
        newRenderedNodes[messageGroupId] = appMessageGroup;
      }
      newRenderedNodes[messageGroupId].style.order = i;
    }

    const unusedNodeKeys = R.pipe(
      R.keys,
      R.filter(R.pipe(
          R.partialRight(R.has, [newRenderedNodes]),
          R.not
        ))
    )(this.renderedNodes);

    for (const key of unusedNodeKeys) {
      this.renderedNodes[key].remove();
    }

    this.renderedNodes = newRenderedNodes;
    return this;
  }
}

Component.init(ScreenConversation, 'screen-conversation', {attributes, properties});
