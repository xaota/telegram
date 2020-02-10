import Component from '../../../script/Component.js';
import $, {updateChildrenProperty} from '../../../script/DOM.js';

import '../../ui/icon/ui-icon.js';
import '../../ui/drop/ui-drop.js';
import '../../message/text/message-text.js';
import FormEmoji from '../../form/emoji/form-emoji.js';

const component = Component.meta(import.meta.url, 'conversation-input');
const attributes = {

};

const properties = {
    disabled(root, value) {
      updateChildrenProperty(root, 'input', 'disabled', value)
    }
};

focus = (input) => {
  input.focus();
};

export default class ConversationInput extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const input = $('textarea', node);
    input.addEventListener('input', this.onChange);

    $('.wrap_textarea', node)
        .addEventListener('click', () => this.focus(input));

    const emoji = $('#emoji', node);
    const dropEmoji = $('#drop-emoji', node);
    emoji.addEventListener('click', () => dropEmoji.show = !dropEmoji.show);

    const attach = $('#attach', node)
    const dropAttach = $('#drop-attach', node);
    attach.addEventListener('click', () => dropAttach.show = !dropAttach.show);

    const formEmoji = $('form-emoji', node);
    formEmoji.addEventListener('emoji-select', e => {
      let value = input.value;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      value = value.slice(0, start) + e.detail.emoji + value.slice(end, value.length);
      input.value = value;
      input.selectionEnd = start + 2;
      this.calculateRows(input);
    });
    return this;
  }

  onChange = (e) => {
    const value = e.target.value;

    // изменяем кнопку отправки сообщения, если есть контент
    if (value.length > 0) {
      $('.action', this.shadowRoot)
          .classList.add('send');
    } else {
      $('.action', this.shadowRoot)
          .classList.remove('send');
    }
    const el = e.target;
    // скидываем заранее заданное значение
    this.calculateRows(el);
  };

  calculateRows = (el) => {
    el.style.height = 'inherit';

    const computed = window.getComputedStyle(el);
    const stepPerRow = parseInt(
        computed.getPropertyValue('line-height'),
        10,
    );
    const padding =
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        parseInt(computed.getPropertyValue('padding-bottom'), 10);
    const maxRows = 10;

    // с учетом вертикальных padding'ов
    const preferredHeight = el.scrollHeight;
    const maxAllowedHeight = maxRows * stepPerRow + padding;

    const newHeight = Math.min(preferredHeight, maxAllowedHeight);
    el.style.height = `${newHeight}px`;
  };
}

Component.init(ConversationInput, component, {attributes, properties});
