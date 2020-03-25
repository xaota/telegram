import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import FormLogin    from '../../form/login/form-login.js';
import FormConfirm  from '../../form/confirm/form-confirm.js';
import FormPassword from '../../form/password/form-password.js';
import FormRegister from '../../form/register/form-register.js';

const component = Component.meta(import.meta.url, 'layout-password');
const attributes = {

  }

const properties = {

  }

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
