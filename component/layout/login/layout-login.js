import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import FormLogin    from '../../form/login/form-login.js';
import FormConfirm  from '../../form/confirm/form-confirm.js';
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
    super.mount(node, attributes, properties);

    const login   = $('form-login', node);
    const confirm = $('form-confirm', node);
    const forms = [login, confirm];

    route(forms);
    channel.on('authorizationStateWaitPhoneNumber', _ => route(forms, login));
    channel.on('authorizationStateWaitCode',        _ => route(forms, confirm));

    // channel.on('login-phone', e => confirm.innerText = e.phone_number);
    channel.on('login-confirm', user => {
      login.style.display = 'block';
      confirm.style.display = 'none';
      channel.send('user.login', user);
    });

    return this;
  }
}

Component.init(LayoutLogin, component, {attributes, properties});

/** */
  function route(forms, form) {
    forms.forEach(f => f.style.display = 'none');
    if (!form) return;
    form.style.display = 'block';
    return form;
  }
