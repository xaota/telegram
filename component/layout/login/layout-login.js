import Component from '../../../script/Component.js';

/* eslint-disable */
import FormLogin    from '../../form/login/form-login.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'layout-login');
const attributes = {

  };

const properties = {

  };

export default class LayoutLogin extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    return this;
  }
}

Component.init(LayoutLogin, component, {attributes, properties});
