import Component from '../../../script/Component.js';
import {updateChildrenHTML} from '../../../script/DOM.js';

/* eslint-disable */
import UIIcon from '../icon/ui-icon.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'ui-item');
const attributes = {
    icon(root, value) { updateChildrenHTML(root, 'ui-icon', value); }
  };

const properties = {

  };

export default class UIItem extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(UIItem, component, {attributes, properties});
