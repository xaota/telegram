import Component, {html, css} from "../../script/ui/Component.js";
import $ from '../../script/ui/DOM.js';
import {wrapAsObjWithKey, createUrl, downloadFile$} from '../../script/helpers.js';

const {map} = rxjs.operators;
const {isObjectOf, construct} = zagram;

const getMedia = R.prop('media');

const getDocument =  R.pipe(R.cond([
    [
      isObjectOf('messageMediaPhoto'),
      R.prop('photo')
    ],
    [R.T, R.prop('document')]
  ]));

const getMediaDocument = R.pipe(getMedia, getDocument);

const getMediaId = R.pipe(getMediaDocument, R.prop('id'));

const getAccessHash = R.pipe(getMediaDocument, R.prop('access_hash'));

const getFileReference = R.pipe(getMediaDocument, R.prop('file_reference'));

const getThumbObject= R.pipe(
  getMediaDocument,
  R.cond([
    [isObjectOf('photo'), R.path(['sizes'])],
    [R.T, R.path(['thumbs'])]
  ]),
  R.filter(isObjectOf('photoSize')),
  R.last
);

const buildInputPhotoFileLocation = R.pipe(
  R.of,
  R.ap([
    R.pipe(getMediaId, wrapAsObjWithKey('id')),
    R.pipe(getAccessHash, wrapAsObjWithKey('access_hash')),
    R.pipe(getFileReference, wrapAsObjWithKey('file_reference')),
    R.pipe(getThumbObject, R.prop('type'), wrapAsObjWithKey('thumb_size'))
  ]),
  R.mergeAll,
  R.partial(construct, ['inputPhotoFileLocation'])
);

const style = css`
  :host {
    display: inline-flex;
    background-size: cover;
    flex: 1 0 calc(33% - 4px);
    cursor: pointer;
  }
  
  .image {
    display: flex;
    width: 100%;
    height 100%;
    background-size: cover;
    background-position: center;
    background-color: grey;
  }
  
  .image:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const attributes = {};
const properties = {};

export default class MediaPreview extends Component {
  static template = html`
    <template>
        <style>${style}</style>
        <div class="image"></div>
    </template>
  `;

  constructor(message) {
    super();
    this.store({message});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const divNode = $('.image', node);

    const {message} = this.store();
    const inputPhotoLocation = buildInputPhotoFileLocation(message);

    downloadFile$(inputPhotoLocation)
      .pipe(map(createUrl))
      .subscribe(
        url => divNode.style.backgroundImage = `url(${url})`,
        error => {
          console.warn('Can`t load file:' );
          console.warn('message:', message);
          console.warn('location:', inputPhotoLocation);
          console.warn('error:', error);
        }
);

    return this;
  }

  render(node) {
    return this;
  }
}

Component.init(MediaPreview, 'media-preview', {attributes, properties});
