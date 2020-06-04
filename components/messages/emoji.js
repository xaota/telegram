import Component, {html, css} from '../../script/ui/Component.js';
import {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: block;

    --color: var(--foreground-label);

    padding-top: .66667rem;
    position: relative;
  }

  slot {
    display: block;
  }

  slot[name="content"] {
    font-size: 5.33333rem;
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

/** {MessageEmoji} @class
  * @description Отображение сообщения-текста-эмодзи
  */
  export default class MessageEmoji extends Component {
    static template = html`
      <template>
        <style>${style}</style>

        <slot name="content"></slot>
        <span></span> <!-- timestamp -->
      </template>`;

  // /** Создание компонента {MessageEmoji} @constructor
  //   // * @param {string?} text содержимое элемента
  //   */
  //   constructor() { // text
  //     super();
  //     // if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessageEmoji} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }

  /**  */
    static test(text = '', max = 3) {
      const symbols = [...text]; // memory!
      const length = text.length, count = symbols.length;
      // todo
      if (length === count || count > max) return false; // точно строка, либо длинее, чем надо
      const test = symbols.slice(0, max);
      return test.every(c => c.charCodeAt(0) !== c.codePointAt(0));
    }
  }

Component.init(MessageEmoji, 'message-emoji', {attributes, properties});
