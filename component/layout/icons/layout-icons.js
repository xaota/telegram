import Component from '../../../script/Component.js';

import UIIcon   from '../../ui/icon/ui-icon.js';
import UIItem   from '../../ui/item/ui-item.js';
import UIHeader from '../../ui/header/ui-header.js';

const component = Component.meta(import.meta.url, 'layout-icons');
const attributes = {

  }

const properties = {

  }

export default class LayoutIcons extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const main = node.querySelector('main');

    const icon = new UIIcon();
    icon.addEventListener('DOMContentLoaded', () => {
      const shadow = icon.shadowRoot;
      const groups = [...shadow.querySelectorAll('svg defs g')].map(e => e.id);
      icon.remove();
      groups.forEach(e => {
        const item = new UIItem();
        const icon = new UIIcon(e);
        item.append(icon);
        item.append(document.createTextNode(e));
        main.append(item);
      });
    });

    node.append(icon);
    return this;
  }
}

Component.init(LayoutIcons, component, {attributes, properties});
