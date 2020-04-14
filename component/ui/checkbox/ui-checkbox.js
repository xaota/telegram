import Component from '../../../script/Component.js';
import {updateChildrenProperty} from '../../../script/DOM.js';

/* eslint-disable */
import UIIcon from '../icon/ui-icon.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'ui-checkbox');
const properties = {
    checked(root, value) {
      updateChildrenProperty(root, 'input[type="checkbox"]', 'checked', value);
    }
  };

export default class UICheckbox extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, {}, properties);

    return this;
  }
}

Component.init(UICheckbox, component, {properties});
