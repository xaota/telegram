import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-grid');
const attributes = {
    rows(root, value) {
        this.style['grid-template-rows'] = value;
    },

    columns(root, value) {
      this.style['grid-template-columns'] = value;
    },

    'row-gap'(root, value) {
        this.style['grid-row-gap'] = value;
    },

    'column-gap'(root, value) {
      this.style['grid-column-gap'] = value;
    }
  };

const properties = {};

export default class UiGrid extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UiGrid, component, {attributes, properties});
