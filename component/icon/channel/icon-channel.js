import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-channel');
const attributes = {

  }

const properties = {

  }

export default class IconChannel extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconChannel, component, {attributes, properties});
