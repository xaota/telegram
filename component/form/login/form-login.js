import Component from '../../../script/Component.js';

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

    return this;
  }
}

Component.init(FormLogin, component, {attributes, properties});
