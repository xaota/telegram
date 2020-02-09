import Component from '../../../script/Component.js';

import UILoading from '../loading/ui-loading.js';

const component = Component.meta(import.meta.url, 'ui-button');
const attributes = {

  }

const properties = {
    loading(root, value) { } // !
  }

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
