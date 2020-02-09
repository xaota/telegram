import Component from '../../../script/Component.js';

import UIIcon     from '../../ui/icon/ui-icon.js';
import UIRadio    from '../../ui/radio/ui-radio.js';
import UIHeader   from '../../ui/header/ui-header.js';
import UICheckbox from '../../ui/checkbox/ui-checkbox.js';
import UIFieldset from '../../ui/fieldset/ui-fieldset.js';

const component = Component.meta(import.meta.url, 'form-general');
const attributes = {

  }

const properties = {

  }

export default class FormGeneral extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormGeneral, component, {attributes, properties});
