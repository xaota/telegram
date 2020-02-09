import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-document');
const attributes = {

  }

const properties = {

  }

export default class IconDocument extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconDocument, component, {attributes, properties});
