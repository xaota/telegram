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
    this.container = $('#container', node);
    this.wrap = $('.wrap', node);

    const profile = new LayoutProfile();
    const search = new LayoutSearch();
    channel.on(events.CLOSE_SIDEBAR, this.close);
    channel.on(events.OPEN_PROFILE, () => {
      this.open(profile);
    });
    channel.on(events.OPEN_SEARCH, () => {
      this.open(search);
    });
    return this;
  }

  open = async (layout) => {
    const open = () => {
      this.container.appendChild(layout);
      this.wrap.style.width = '420px';
    };
    if (!this.container.children) {
      open();
    }
    if (this.container.children[0] !== layout) {
      await this.close();
      open();
    }
  };

  close = () => {
    return new Promise(resolve => {
      this.wrap.style.width = '0px';
      setTimeout(() => {
        this.container.innerHTML = '';
        resolve();
      }, 300);
    })
  }
}

Component.init(LayoutSidebar, component, {attributes, properties});
