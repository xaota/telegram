import Component from '../../../script/Component.js';
import $, {updateChildrenProperty} from '../../../script/DOM.js';
import telegram from '../../../tdweb/Telegram.js';

import UiIcon from '../../ui/icon/ui-icon.js';
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
    this.sendIcon = new UiIcon('send');
    this.microIcon = new UiIcon('micro-2');
  }

  mount(node) {
    super.mount(node, attributes, properties);
    this.chat = this.getAttribute('chat');

    this.action = $('.action', this.shadowRoot);

    this.input = $('textarea', node);
    this.input.addEventListener('input', this.onChange);

    $('.wrap_textarea', node)
        .addEventListener('click', () => this.focus(this.input));

    const emoji = $('#emoji', node);
    const dropEmoji = $('#drop-emoji', node);
    emoji.addEventListener('click', () => dropEmoji.show = !dropEmoji.show);

    const attach = $('#attach', node)
    const dropAttach = $('#drop-attach', node);
    attach.addEventListener('click', () => dropAttach.show = !dropAttach.show);

    const formEmoji = $('form-emoji', node);
    formEmoji.addEventListener('emoji-select', e => {
      let value = this.input.value;
      const start = this.input.selectionStart;
      const end = this.input.selectionEnd;
      value = value.slice(0, start) + e.detail.emoji + value.slice(end, value.length);
      this.input.value = value;
      this.input.selectionEnd = start + 2;
      this.onChange(this.input);
      this.replaceActionIcon();
    });
    formEmoji.addEventListener('sticker-select', e => {
      const id = e.detail.emoji;
      const content = {
        '@type': 'inputMessageSticker',
        sticker: {
          '@type': 'inputFileId',
          id,
        },
        width: 100,
        height: 100,
      };
      this.sendMessage(content)
    });

    $('.action', node)
        .addEventListener('click', this.onAction);
    return this;
  }

  replaceActionIcon = () => {
    const inner = this.action.children[0].innerHTML;
    const value = this.input.value;
    if (value.length > 0 && inner !== 'send') {
      this.action
          .children[0]
          .replaceWith(this.sendIcon);
    } else if (value.length === 0 && inner !== 'micro-2') {
      this.action
          .children[0]
          .replaceWith(this.microIcon);
    }
  };

  onChange = (e) => {
    this.replaceActionIcon();
    this.calculateRows(this.input);
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

  onAction = (e) => {
    const formattedText = {
      '@type': 'formattedText',
      text: this.input.value,
    };
    const inputContent = {
      '@type': 'inputMessageText',
      text: formattedText,
      disable_web_page_preview: false,
      clear_draft: true
    };

    sendMessage(content);
    this.input.value = '';
  }

  sendMessage = (content) => {
    telegram.api('sendMessage', {
      chat_id: this.chat,
      input_message_content: content
    });
  }
}

Component.init(ConversationInput, component, {attributes, properties});
