import Component, {html, css} from '../../script/ui/Component.js';
import $, {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';
import {wrapAsObjWithKey, createUrl, downloadFile$} from '../../script/helpers.js';

const {map} = rxjs.operators;
const {isObjectOf, construct} = zagram;

const style = css`
  :host {
    display: block;
    position: relative;
  }

  img {
    height: 100%;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .img {
    min-width: 200px;
  }
  .solo img {
    border-radius: 5px;
  }
  :host {
    display: block;
    font-size: 14px;
    --color: var(--foreground-label);
  }

  :host([reply]) {
    font-size: 13px;
  }

  .main {
    display: flex;
    flex-direction: column;
    background: var(--field);
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
    max-width: 40rem;
    text-align: left;
    padding: 0;
    /*padding: 8px 6px;*/
    word-break: break-word;
  }

  .solo {
    flex-direction: row;
  }
  :host([left]) .main {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background: var(--background-message-in);
  }

  :host([right]) .main {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    background: var(--background-message-out);
  }

  :host([timestamp]) slot[name="content"]::slotted(span):after {
    content: "";
    display: inline-block;
    width: 1.8rem;
  }

  #time { /* timestamp */
    position: absolute;
    /* display: block;
    text-align: right; */
    font-size: 0.73333rem;
    color: #a3adb6;
    font-weight: 400;
    right: 4px;
    bottom: 1px;
  }

  :host([reply]) span {
    display: none;
  }`;

const attributes = {
  color(root, value) { cssVariable(this, 'color', value); },
  timestamp(root, value) { updateChildrenText(root, 'span', value); }
  // status=received, sended
  // views
  // sign (author)
};
const properties = {
  // edited
};

//

// const getDocument =  R.pipe(R.cond([
//   [
//     isObjectOf('messageMediaPhoto'),
//     R.prop('photo')
//   ],
//   [R.T, R.prop('document')]
// ]));

// const getMediaDocument = R.pipe(getMedia, getDocument);

const getMediaId = R.pipe(R.prop('id'));

const getAccessHash = R.pipe(R.prop('access_hash'));

const getFileReference = R.pipe(R.prop('file_reference'));

/**
* @param {Object} message - telegrams message with media
* @returns {Object} - information about size preview
*/
const getThumbObject = R.pipe(
  // getMediaDocument,
  R.cond([
    [isObjectOf('photo'), R.path(['sizes'])],
    [R.T, R.path(['thumbs'])]
  ]),
  R.filter(isObjectOf('photoSize')),
  R.last
);

/**
 * @param {Object} message - telegrams message with media
 * @returns {Object} - params for building InputFileLocation object
 */
const buildInputFileParams = R.pipe(
  R.of,
  R.ap([
    R.pipe(getMediaId, wrapAsObjWithKey('id')),
    R.pipe(getAccessHash, wrapAsObjWithKey('access_hash')),
    R.pipe(getFileReference, wrapAsObjWithKey('file_reference')),
    R.pipe(getThumbObject, R.prop('type'), wrapAsObjWithKey('thumb_size'))
  ]),
  R.mergeAll
);

/**
 * @param {Object} message - telegrams message with messageMediaPhoto
 * @return {Object} - inputPhotoFileLocation object
 */
const buildInputPhotoFileLocation = R.pipe(
  buildInputFileParams,
  R.partial(construct, ['inputPhotoFileLocation'])
);

/** {MessagePhoto} @class
  * @description Отображение сообщения-фотографии
  * @property {string} угу
  */
  export default class MessagePhoto extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <div class="main">
          <div class="image">
            <!-- <img /> -->
          </div>
          <slot name="content"></slot>
        </div>
        <span id="time"></span> <!-- timestamp -->
      </template>`;

  /** Создание компонента {MessagePhoto} @constructor
    * @param {object?} photo сообщение
    */
    constructor(photo) {
      super();
      if (photo) this.store({photo});
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessagePhoto} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const {photo} = this.store();
      if (!photo) return this; // !
      const divNode = $('.image', node);

      MessagePhoto.src(photo).then(url => {
        const img = new Image();
        img.src = url;
        divNode.append(img);
      });

      return this;
    }

    static src(photo) {
      return new Promise((resolve, reject) => {
        const inputPhotoLocation = buildInputPhotoFileLocation(photo);

        downloadFile$(inputPhotoLocation)
          .pipe(map(createUrl))
          .subscribe(
            url => resolve(url),
            error => {
              console.warn('Can`t load file:' );
              console.warn('photo:', photo);
              console.warn('location:', inputPhotoLocation);
              console.warn('error:', error);
              reject(error);
            }
          );
      });
    }
  }

Component.init(MessagePhoto, 'message-photo', {attributes, properties});
