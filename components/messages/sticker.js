import Component, {html, css} from '../../script/ui/Component.js';
import $, {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';
import {downloadFile$, createUrl, getTimestamp} from '../../script/helpers.js';
import {
  buildInputDocumentFileLocation,
  getMediaDocument,
  getThumbObjectFromMessage
} from '../../script/utils/message.js';

const {of} = rxjs;
const {map, switchMap} = rxjs.operators;

const isImageSticker = R.pipe(
  getMediaDocument,
  R.propEq('mime_type', 'image/webp')
);

const style = css`
  :host {
    display: block;
    position: relative;
  }

  img {
    width: 128px;
    height: 128px;
  }

  span {
    position: absolute;
    font-size: .73333rem;
    /* color: #a3adb6; */
    font-weight: 400;
    right: 4PX;
    bottom: 1PX;

    background: rgba(0,0,0,.2);
    border-radius: .73333rem;
    padding: 2PX 6PX;
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

/** {MessageSticker} @class
  * @description Отображение сообщения-текста
  */
  export default class MessageSticker extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <div class="image-place"></div>
        <span class="timestamp"></span> <!-- timestamp -->
      </template>`;

  /** Создание компонента {MessageSticker} @constructor
    * @param {object?} sticker сообщение
    */
    constructor(message) {
      super();
      this.store({message});
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessageSticker} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const {message} = this.store();

      if (isImageSticker(message)) {
        const stickerFile$ = of(message).pipe(
          map(buildInputDocumentFileLocation),
          switchMap(downloadFile$),
          map(createUrl)
        );

        stickerFile$.subscribe(fileUrl => {
          const imgPlaceNode = $('.image-place', node);
          const imgNode = new Image();

          const thumbInfo = getThumbObjectFromMessage(message);
          console.log("Thumb info", thumbInfo);
          if (R.isNil(thumbInfo)) {
            console.warn("Cat get thumb size from", message);
          } else {
            imgNode.style.height = `${thumbInfo.h}px`;
            imgNode.style.width = `${thumbInfo.w}px`;
          }
          imgNode.src = fileUrl;

          imgPlaceNode.appendChild(imgNode);
        });
      } else {
        console.log('Download and display animated sticker');
      }

      const timestamp = getTimestamp(message.date);
      const timestampNode = $('.timestamp', node);
      timestampNode.innerText = timestamp;
      return this;
    }

  /** */
    static from(sticker, time) {
      const content = new MessageSticker(sticker);
      content.timestamp = time;
      return content;
    }
  }

Component.init(MessageSticker, 'message-sticker', {attributes, properties});
