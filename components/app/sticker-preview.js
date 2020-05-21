import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {loadStickerSet} from '../../state/stickers/index.js';
import {stickerSetDocument$} from '../../state/stickers/stream-builders.js';
import StickerThumb from './sticker-thumb.js';

const {Subject} = rxjs;
const {filter, single, distinctUntilChanged} = rxjs.operators;

const MAX_WIDTH = 320;
const TITLE_HEIGHT = 48;
const ROW_STICKER_ITEM_COUNT = 5;
const STICKER_ITEM_WIDTH = MAX_WIDTH / ROW_STICKER_ITEM_COUNT;
const STICKER_ITEM_HEIGHT = STICKER_ITEM_WIDTH;

const getTitle = R.prop('title');

const getCount = R.prop('count');

const getDocumentId = R.pipe(R.prop('id'), R.toString);

const getPreviewListHeight = R.pipe(
  getCount,
  R.divide(R.__, ROW_STICKER_ITEM_COUNT),
  Math.ceil,
  R.multiply(STICKER_ITEM_HEIGHT)
);


function buildShow$(node, parentNode) {
  const baseOptions = {
    root: parentNode,
    rootMargin: '0px'
  };

  const subject = new Subject();

  const observer = new IntersectionObserver(
    entries => {
      subject.next(entries[0].isIntersecting);
    },
    {...baseOptions, threshold: 0.0}
  );
  observer.observe(node);

  return subject;
}

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    width: ${MAX_WIDTH}px;
  }
  
  .wrapper {
    display: flex;
    flex-direction: column;
    width: ${MAX_WIDTH}px;
  }
  
  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: ${TITLE_HEIGHT}px;
    color: rgb(112, 117, 121);
    font-size: 16px;
    font-weight: 500;
    padding-left: 8px;
  }
  
  .preview-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .preview-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${STICKER_ITEM_WIDTH}px;
    height: ${STICKER_ITEM_HEIGHT}px
  }
`;
const attributes = {};
const properties = {};
export default class StickerPreview extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="wrapper">
        <div class="title"></div>
        <div class="preview-list"></div>
      </div>
    </template>
  `;

  constructor(stickerSet, viewportNode) {
    super();

    this.stickerSet = stickerSet;
    this.viewportNode = viewportNode;

    this.renderedThumbs = {};
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const titleNode = $('.title', node);
    titleNode.innerText = getTitle(this.stickerSet);

    const previewListNode = $('.preview-list', node);
    previewListNode.style.height = `${getPreviewListHeight(this.stickerSet)}px`;


    const state$ = getState$();
    const document$ = stickerSetDocument$(state$, this.stickerSet).pipe(distinctUntilChanged(R.eqProps('length')));
    document$.subscribe(stickers => {
      this.store({stickers});
    });

    const hostNode = $('.wrapper', node);
    const show$ = buildShow$(hostNode, this.viewportNode).pipe(distinctUntilChanged());
    const showOnce$ = show$.pipe(
      filter(R.equals(true)),
      distinctUntilChanged()
    );

    show$.subscribe(rendered => {
      this.store({rendered});
    });

    showOnce$.subscribe(() => {
      loadStickerSet(this.stickerSet);
    });

    return this;
  }

  render(node) {
    super.render(node);
    const {rendered, stickers} = this.store();

    const previewListNode = $('.preview-list', node);
    if (rendered) {
      for (const sticker of stickers) {
        const stickerId = getDocumentId(sticker);

        if (R.has(stickerId, this.renderedThumbs)) {
          continue;
        }
        const element = new StickerThumb(sticker, STICKER_ITEM_HEIGHT);
        previewListNode.appendChild(element);
        this.renderedThumbs[stickerId] = element;
      }
    } else {
      this.renderedThumbs = {};
      previewListNode.innerHTML = '';
    }

    return this;
  }
}

Component.init(StickerPreview, 'sticker-preview', {attributes, properties});
