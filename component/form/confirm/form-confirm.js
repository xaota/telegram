import Component from '../../../script/Component.js';

import UIInput from '../../ui/input/ui-input.js';
import UIButton from '../../ui/button/ui-button.js';
import IconEdit from '../../icon/edit/icon-edit.js';
import UISticker from '../../ui/sticker/ui-sticker.js';

const component = Component.meta(import.meta.url, 'form-confirm');
const attributes = {

  }

const properties = {

  }

export default class FormConfirm extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormConfirm, component, {attributes, properties});
