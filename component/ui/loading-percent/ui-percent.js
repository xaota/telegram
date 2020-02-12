import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-loading-percent');

const attributes = {
    percent(root, value) {
        const circle = $('circle', root);
        if (circle) {
            const dashoffset = -283 + 2.83 * value;
            circle.style.setProperty("stroke-dashoffset", dashoffset);  // -283
        }
    },
    size(root, value) {
        const svg = $('svg', root);
        if (svg) {
            svg.style.setProperty("width", value);
        }
    },
};

const properties = {}

export default class UiPercent extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UiPercent, component, {attributes, properties});
