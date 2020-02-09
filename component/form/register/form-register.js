import Component from '../../../script/Component.js';

import UIIcon    from '../../ui/icon/ui-icon.js';
import UIInput   from '../../ui/input/ui-input.js';
import UIButton  from '../../ui/button/ui-button.js';
import UISticker from '../../ui/sticker/ui-sticker.js';

const component = Component.meta(import.meta.url, 'form-register');
const attributes = {

  }

const properties = {

  }

export default class FormRegister extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormRegister, component, {attributes, properties});
