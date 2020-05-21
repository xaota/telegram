import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getAllStickers} from '../../state/stickers/index.js';
import {getStickerSets$} from '../../state/stickers/stream-builders.js';
import StickerPreview from './sticker-preview.js';
import {getStickerSetId} from '../../state/stickers/utils.js';

const {filter} = rxjs.operators;

const isNotEmpty = R.pipe(R.length, R.lt(0));

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 0px;
    flex-grow: 1;
    overflow-y: auto;
  }
`;
const properties = {};
const attributes = {};
export default class StickerPicker extends Component {
  static template = html`
    <template>
      <style>${style}</style>
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);
    const state$ = getState$();
    const stickerSet$ = getStickerSets$(state$)
      .pipe(filter(isNotEmpty));

    stickerSet$.subscribe(stickerSetList => {
      const {renderedStickers = {}} = this.store();

      for (const stickerSet of stickerSetList) {
        const stickerSetId = getStickerSetId(stickerSet);

        if (R.has(stickerSetId, renderedStickers)) {
          continue;
        }

        const element = new StickerPreview(stickerSet, $(':host', node));
        renderedStickers[stickerSetId] = true;
        node.appendChild(element);
      }

      this.store({renderedStickers});
    });

    getAllStickers();
    return this;
  }
}

Component.init(StickerPicker, 'sticker-picker', {attributes, properties});
