import Component, {html, css} from '../../script/ui/Component.js';
import {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';

// import MessagePhoto from './photo.js';

const style = css`
  :host {
    display: block;
    position: relative;
  }

  img {
    width: 200px;
    height: 200px;
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

        <img />
        <span></span> <!-- timestamp -->
      </template>`;

  /** Создание компонента {MessageSticker} @constructor
    * @param {object?} sticker сообщение
    */
    constructor(sticker) {
      super();
      if (sticker) this.store({sticker});
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessageSticker} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      // const data = this.store();
      // File.getFile(data.is_animated ? data.thumbnail.photo : data.sticker).then(blob => updateChildrenAttribute(node, 'img', 'src', blob));

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
