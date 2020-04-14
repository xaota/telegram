import Component from '../../../script/Component.js';
import {updateChildrenProperty, updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-radio');
const attributes = {
    hint(root, value) { updateChildrenHTML(root, 'span.hint', value); }
  };

const properties = {
    checked(root, value) { updateChildrenProperty(root, 'input[type="checkbox"]', 'checked', value); }
  };

export default class UIRadio extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UIRadio, component, {attributes, properties});
