import Component from '../../../script/Component.js';

import UITab  from '../../ui/tab/ui-tab.js';
import UITabs from '../../ui/tabs/ui-tabs.js';

import IconEmoji from '../../icon/emoji/icon-emoji.js';

const component = Component.meta(import.meta.url, 'form-emoji');
const attributes = {

  }

const properties = {

  }

export default class FormEmoji extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormEmoji, component, {attributes, properties});
