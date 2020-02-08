import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'form-notifications');
const attributes = {

  }

const properties = {

  }

export default class FormNotifications extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormNotifications, component, {attributes, properties});
