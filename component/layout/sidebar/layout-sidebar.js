import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';
const component = Component.meta(import.meta.url, 'layout-sidebar');
const attributes = {

  }

const properties = {

  }

export default class LayoutSidebar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('#close', node)
        .addEventListener('click', () => {
          this.event('close-sidebar');
        });
    return this;
  }
}

Component.init(LayoutSidebar, component, {attributes, properties});
