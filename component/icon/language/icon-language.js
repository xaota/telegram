import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-language');
const attributes = {

  }

const properties = {

  }

export default class IconLanguage extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconLanguage, component, {attributes, properties});
