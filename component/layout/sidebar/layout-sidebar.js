import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import LayoutSearch from '../search/layout-search.js';
import LayoutProfile from '../profile/layout-profile.js';

import events from './events.js';

const component = Component.meta(import.meta.url, 'layout-sidebar');
const attributes = {

  }

const properties = {

  }


export default class LayoutSidebar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const container = $('#container', node);
    const wrap = $('.wrap', node);

    const profile = new LayoutProfile();
    const search = new LayoutSearch();
    channel.on(events.CLOSE_SIDEBAR, () => {
      wrap.style.width = '0px';
      animation(100, () => container.innerHTML = '');
    });
    channel.on(events.OPEN_PROFILE, () => {
      container.appendChild(profile);
      wrap.style.width = '420px';
    });
    channel.on(events.OPEN_SEARCH, () => {
      container.appendChild(search);
      wrap.style.width = '420px';
    });
    return this;
  }
}

Component.init(LayoutSidebar, component, {attributes, properties});

function animation(time, callback) {
  setTimeout(callback, time);
}
