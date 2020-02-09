import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UILogo     from '../../ui/logo/ui-logo.js';
import UIInput    from '../../ui/input/ui-input.js';
import UIButton   from '../../ui/button/ui-button.js';
import UICountry  from '../../ui/country/ui-country.js';
import UICheckbox from '../../ui/checkbox/ui-checkbox.js';

const component = Component.meta(import.meta.url, 'form-login');
const attributes = {

  }

const properties = {

  }

export default class FormLogin extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const phone = $('ui-input', node);
    const button = $('ui-button', node);

    phone.addEventListener('change', _ => {
      button.style.display = phone.value.length > 0 ? 'block' : 'none';
    });

    button.addEventListener('click', _ => {
      phone.disabled = true;
      button.loading = true;
      setTimeout(_ => {
        channel.send('login-success', {phone: phone.value});
        wipe.call(this, phone, button);
      }, 3000);
    });

    return this;
  }
}

Component.init(FormLogin, component, {attributes, properties});

/** */
  function wipe(phone, button) {
    phone.value = '';
    button.loading = false;
    button.style.display = 'none';
  }
