import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-exit');
const attributes = {

  }

const properties = {

  }

export default class IconExit extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(IconExit, component, {attributes, properties});
