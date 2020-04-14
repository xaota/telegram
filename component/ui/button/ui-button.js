import Component from '../../../script/Component.js';

/* eslint-disable */
import UILoading from '../loading/ui-loading.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'ui-button');
const attributes = {

  };

const properties = {
    loading(root, value) { } // eslint-disable-line
  };

export default class UIButton extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(attributes, properties);

    return this;
  }
}

Component.init(UIButton, component, {attributes, properties});
