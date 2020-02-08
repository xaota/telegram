import Component from '../../../script/Component.js';
import $, {updateChildrenProperty} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'conversation-input');
const attributes = {

  }

const properties = {
    disabled(root, value) {
      updateChildrenProperty(root, 'input', 'disabled', value)
    }
  }

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
  }
}

Component.init(ConversationInput, component, {attributes, properties});
