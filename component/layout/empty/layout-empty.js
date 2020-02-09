import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIIcon from '../../ui/icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'layout-empty');
const attributes = {

  }

const properties = {

  }

export default class LayoutEmpty extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const group = $('#group ui-icon', node);
    group.addEventListener('click', _ => channel.send('route-aside', {route: 'form-group'}));
    return this;
  }
}

Component.init(LayoutEmpty, component, {attributes, properties});
