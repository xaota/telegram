import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'avatar-edit');
const attributes = {

  };

const properties = {

  };

export default class AvatarEdit extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(AvatarEdit, component, {attributes, properties});
