import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-ball');
const attributes = {

  }

const properties = {

  }

export default class IconBall extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconBall, component, {attributes, properties});
