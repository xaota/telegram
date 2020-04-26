import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogId$,
  getActiveDialogSearchedMessages$
} from '../../state/dialogs/stream-builders.js';
import MediaPreview from './media-preview.js';

const {distinctUntilChanged} = rxjs.operators;

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
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);
    const listNode = $('.list', node);


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

    return this;
  }
}

Component.init(MediaFileList, 'media-file-list', {attributes, properties});
