import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-photo');
const attributes = {

  }

const properties = {

  }

export default class IconPhoto extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconPhoto, component, {attributes, properties});
