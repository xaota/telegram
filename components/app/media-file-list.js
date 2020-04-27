import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogId$,
  getActiveDialogSearchedMessages$,
  getActiveDialogInputPeer$,
  getLastSearchedMessageId$
} from '../../state/dialogs/stream-builders.js';
import {searchDialogMessages} from '../../state/dialogs/actions.js';
import MediaPreview from './media-preview.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';

const {construct} = zagram;
const {of, fromEvent} = rxjs;
const {map, distinctUntilChanged, withLatestFrom} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: column;
  }
  
  .list {
    display: flex; 
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }
`;

const attributes = {};

const properties = {};


export default class MediaFileList extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="list">
      </div>
      <button id="load-more">load more</button>
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);
    const listNode = $('.list', node);
    const loadMoreButton = $('#load-more', node);

    const state$ = getState$();

    const activeDailogId$ = getActiveDialogId$(state$);
    activeDailogId$.pipe(distinctUntilChanged()).subscribe(() => {
      listNode.innerHTML = '';
      this.store({messageIds: {}});
    });

    const searchedMessages$ = getActiveDialogSearchedMessages$(state$);
    searchedMessages$.subscribe(messages => {
      const {messageIds = {}} = this.store();
      const newMessageIds = {};

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        if (R.has(message.id, messageIds)) {
          continue;
        }

        const mediaPreview = new MediaPreview(message);

        listNode.append(mediaPreview);

        newMessageIds[message.id] = true;
      }

      this.store({messageIds: R.merge(messageIds, newMessageIds)});
    });

    const loadMoreButtonClick$ = fromEvent(loadMoreButton, 'click');
    const activeDialogInputPeer$ = getActiveDialogInputPeer$(state$);
    const lastSearchMessageId$ = getLastSearchedMessageId$(state$);

    const loadMore$ = loadMoreButtonClick$.pipe(
      withLatestFrom(activeDialogInputPeer$
          .pipe(map(wrapAsObjWithKey('peer')))),
      withLatestFrom(of(construct('inputMessagesFilterPhotoVideo'))
          .pipe(map(wrapAsObjWithKey('filter')))),
      withLatestFrom(lastSearchMessageId$
          .pipe(map(wrapAsObjWithKey('offset_id')))),
      map(R.flatten),
      map(R.remove(0, 1)),
      map(R.mergeAll)
    );


    loadMore$.subscribe(searchDialogMessages);
    return this;
  }
}

Component.init(MediaFileList, 'media-file-list', {attributes, properties});
