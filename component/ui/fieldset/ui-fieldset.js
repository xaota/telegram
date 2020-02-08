import Component from '../../../script/Component.js';
import $, {updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-fieldset');
const attributes = {
    name(root, value) { updateChildrenHTML(root, 'h1', value) }
  }

const properties = {

  }

export default class UIFieldset extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UIFieldset, component, {attributes, properties});
