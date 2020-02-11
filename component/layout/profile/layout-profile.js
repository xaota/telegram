import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import sidebarEvents from '../sidebar/events.js';
import '../../ui/grid/ui-grid.js';
import UiMember from '../../ui/member/ui-member.js';
import UiFile from '../../ui/file/ui-file.js';
import UiGrid from '../../ui/online/ui-online.js';

const component = Component.meta(import.meta.url, 'layout-profile');
const attributes = {

  }

const properties = {

  }

export default class LayoutProfile extends Component {
  constructor() {
    super(component);
    this.selectedTab = 'media';
    this.grid = new UiGrid();
  }

  mount(node) {
    super.mount(node, attributes, properties);
    $('#close', node)
        .addEventListener('click', () => {
          channel.send(sidebarEvents.CLOSE_SIDEBAR);
        });
    $('ui-tabs', node).addEventListener('click', this.onSelectTab);
    this.tabContainer = $('#tabContainer', node);
    return this;
  }

  onSelectTab = (e) => {
    const id = e.target.getAttribute('id');
    if (id && id !== this.selectedTab) {
      $(`#${this.selectedTab}`, this.shadowRoot).removeAttribute('selected');
      e.target.setAttribute('selected', '');
      this.selectedTab = id;
      this.renderTabContent();
    }
  };

  renderTabContent = () => {
    // if (this.selectedTab === 'media') {
    //   this.grid.appendChild();
    //   this.tabContainer.appendChild(this.grid);
    // }
  };
}

Component.init(LayoutProfile, component, {attributes, properties});
