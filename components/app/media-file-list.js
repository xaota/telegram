import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogId$,
  getActiveDialogSearchedMessages$,
  getActiveDialogInputPeer$,
  getLastSearchedMessageId$
} from '../../state/dialogs/stream-builders.js';
import {searchDialogMessages, clearSearchedDialogs} from '../../state/dialogs/actions.js';
import VirtualList from '../ui/virtual-list.js';
import MediaFileRow from './media-file-row.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {peerIdToPeer} from '../../state/utils.js';

const {construct} = zagram;
const {of, fromEvent, combineLatest} = rxjs;
const {map, distinctUntilChanged, withLatestFrom, startWith} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .list {
    display: flex; 
    flex-direction: column;
    flex-grow: 1;
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
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);
    const listNode = $('.list', node);

    const state$ = getState$();

    const activeDailogId$ = getActiveDialogId$(state$).pipe(distinctUntilChanged());
    activeDailogId$.subscribe(dialogId => {
      clearSearchedDialogs(peerIdToPeer(dialogId));
      listNode.innerHTML = '';
      this.store({messageIds: {}});
    });

    const getMessageGroupId = R.pipe(
      R.map(R.pipe(R.prop('id'), R.toString)),
      R.join('_')
    );
    const searchedMessages$ = getActiveDialogSearchedMessages$(state$).pipe(map(R.splitEvery(4)));
    const virtualList = new VirtualList(searchedMessages$, MediaFileRow, 80, getMessageGroupId);
    listNode.appendChild(virtualList);

    const loadMoreButtonClick$ = fromEvent(virtualList, 'load-more')
      .pipe(startWith(null));
    const activeDialogInputPeer$ = getActiveDialogInputPeer$(state$);
    const lastSearchMessageId$ = getLastSearchedMessageId$(state$);

    const loadMore$ = combineLatest(loadMoreButtonClick$, activeDailogId$).pipe(
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
