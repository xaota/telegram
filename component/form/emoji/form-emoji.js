import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-emoji');
const attributes = {

  }

const properties = {

  }

export default class FormEmoji extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormEmoji, component, {attributes, properties});
