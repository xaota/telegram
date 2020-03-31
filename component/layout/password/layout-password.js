import Component from '../../../script/Component.js';

/* eslint-disable */
import FormPassword from '../../form/password/form-password.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'layout-password');
const attributes = {

  };

const properties = {

  };

export default class LayoutPassword extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    return this;
  }
}

Component.init(LayoutPassword, component, {attributes, properties});
