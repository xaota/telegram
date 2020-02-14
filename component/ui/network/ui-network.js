import Component from '../../../script/Component.js';
import {channel} from '../../../script/DOM.js';

import UIIcon    from '../icon/ui-icon.js';
import UILoading from '../loading/ui-loading.js';

const component = Component.meta(import.meta.url, 'ui-network');
const attributes = {}
const properties = {}

export default class UINetwork extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    channel.on('connection.state', ({type}) => {
      this.removeAttribute('ready');
      this.removeAttribute('updating');
      this.removeAttribute('connecting');

      this.setAttribute(type, '');
    });
    return this;
  }
}

Component.init(UINetwork, component, {attributes, properties});
