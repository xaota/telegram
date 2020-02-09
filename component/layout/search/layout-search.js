import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import sidebarEvents from '../sidebar/events.js';

const component = Component.meta(import.meta.url, 'layout-search');
const attributes = {

  }

const properties = {

  }

export default class LayoutSearch extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('#close', node)
        .addEventListener('click', () => {
          channel.send(sidebarEvents.CLOSE_SIDEBAR);
        });
    return this;
  }
}

Component.init(LayoutSearch, component, {attributes, properties});
