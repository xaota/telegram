import Component from '../../../script/Component.js';

import FormLogin from '../../form/login/form-login.js';
import FormConfirm from '../../form/confirm/form-confirm.js';
import FormPassword from '../../form/password/form-password.js';
import FormRegister from '../../form/register/form-register.js';

const component = Component.meta(import.meta.url, 'layout-login');
const attributes = {

  }

const properties = {

  }

export default class LayoutLogin extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(attributes, properties);

    return this;
  }
}

Component.init(LayoutLogin, component, {attributes, properties});
