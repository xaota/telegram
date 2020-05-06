import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogId$,
  getActiveDialogSearchedMessages$,
  getActiveDialogInputPeer$,
  getLastSearchedMessageId$
} from '../../state/dialogs/stream-builders.js';
import {searchDialogMessages, clearSearchedDialogs} from '../../state/dialogs/actions.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {peerIdToPeer} from '../../state/utils.js';
import DocumentPreview from './document-preview.js';
import VirtualList from '../ui/virtual-list.js';

const {construct} = zagram;
const {of, fromEvent, combineLatest} = rxjs;
const {map, distinctUntilChanged, withLatestFrom} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .list {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
`;

const attributes = {};

const properties = {};


export default class DocumentFileList extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="list"></div>
    </template>
  `;

  mount(node) {
    console.log('mount document file list');
    super.mount(node, attributes, properties);
    const listNode = $('.list', node);

    const state$ = getState$();

    const activeDailogId$ = getActiveDialogId$(state$).pipe(distinctUntilChanged());
    activeDailogId$.subscribe(dialogId => {
      clearSearchedDialogs(peerIdToPeer(dialogId));
      listNode.innerHTML = '';
      this.store({messageIds: {}});
    });

    const searchedMessages$ = getActiveDialogSearchedMessages$(state$);
    const virtualList = new VirtualList(
      searchedMessages$,
      DocumentPreview,
      64,
      R.pipe(R.prop('id'), R.toString)
    );
    listNode.append(virtualList);

    const loadMoreEvent$ = fromEvent(virtualList, 'load-more');
    const activeDialogInputPeer$ = getActiveDialogInputPeer$(state$);
    const lastSearchMessageId$ = getLastSearchedMessageId$(state$);

    const loadMore$ = combineLatest(loadMoreEvent$, activeDailogId$).pipe(
      withLatestFrom(activeDialogInputPeer$
        .pipe(map(wrapAsObjWithKey('peer')))),
      withLatestFrom(of(construct('inputMessagesFilterDocument'))
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

Component.init(DocumentFileList, 'document-file-list', {attributes, properties});
