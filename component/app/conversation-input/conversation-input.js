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

export default class ConversationInput extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(ConversationInput, component, {attributes, properties});
