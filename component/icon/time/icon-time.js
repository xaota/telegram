import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-time');
const attributes = {

  }

const properties = {

  }

export default class IconTime extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconTime, component, {attributes, properties});
