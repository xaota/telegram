import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-favorite');
const attributes = {

  }

const properties = {

  }

export default class IconFavorite extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconFavorite, component, {attributes, properties});
