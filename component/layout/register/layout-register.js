import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import FormRegister from '../../form/register/form-register.js';

const component = Component.meta(import.meta.url, 'layout-register');
const attributes = {

  }

const properties = {

  }

export default class LayoutRegister extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    return this;
  }
}

Component.init(LayoutRegister, component, {attributes, properties});
