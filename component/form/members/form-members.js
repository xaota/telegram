import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-members');
const attributes = {

  };

const properties = {

  };

export default class FormMembers extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormMembers, component, {attributes, properties});
