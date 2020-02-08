import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-drop');
const attributes = {

  }

const properties = {
    show(root, value) {  }
  }

export default class UIDrop extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UIDrop, component, {attributes, properties});
