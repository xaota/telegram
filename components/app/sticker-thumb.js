import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {buildThumbInputFileParams} from '../../script/utils/message.js';
import {downloadFile$, createUrl} from '../../script/helpers.js';


const {fromEvent, of} = rxjs;
const {map, switchMap} = rxjs.operators;
const {construct} = zagram;

const buildThumbObject = R.pipe(
  buildThumbInputFileParams,
  R.partial(construct, ['inputDocumentFileLocation'])
);

const style = css`
  .sticker-thumb {
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
`;
const properties = {};
const attributes = {};
export default class StickerThumb extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="sticker-thumb"></div>
    </template>
  `;

  constructor(stickerDocument, size) {
    super();
    this.size = size;
    this.stickerDocument = stickerDocument;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const stickerThumbNode = $('.sticker-thumb', node);

    if (this.size) {
      stickerThumbNode.style.height = `${this.size}px`;
      stickerThumbNode.style.width = `${this.size}px`;
    }

    const thumbImage$ = of(this.stickerDocument).pipe(
      map(buildThumbObject),
      switchMap(downloadFile$),
      map(createUrl)
    );

    thumbImage$.subscribe(url => {
      stickerThumbNode.style.backgroundImage = `url(${url})`;
    });

    const click$ = fromEvent(stickerThumbNode, 'click');
    click$.subscribe(() => {
      this.event('sticker-selected', this.stickerDocument);
    });

    return this;
  }
}

Component.init(StickerThumb, 'sticker-thumb', {properties, attributes});
