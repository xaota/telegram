import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-security');
const attributes = {

  }

const properties = {

  }

export default class IconSecurity extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconSecurity, component, {attributes, properties});
