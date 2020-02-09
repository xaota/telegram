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
    const newGroup   = $('#group ui-icon', node);
    const newChannel = $('#channel ui-icon', node);
    newGroup  .addEventListener('click', _ => channel.send('route-aside', {route: 'form-group'}));
    newChannel.addEventListener('click', _ => channel.send('route-aside', {route: 'form-channel'}));
    return this;
  }
}

Component.init(LayoutEmpty, component, {attributes, properties});
