import Component from '../../../script/Component.js';

import UIFAB      from '../../ui/fab/ui-fab.js';
import UIInput    from '../../ui/input/ui-input.js';
import UIHeader   from '../../ui/header/ui-header.js';
import UIFieldset from '../../ui/fieldset/ui-fieldset.js';

import IconCheck    from '../../icon/check/icon-check.js';
import IconPhotoAdd from '../../icon/photo-add/icon-photo-add.js';

const component = Component.meta(import.meta.url, 'form-settings');
const attributes = {

  }

const properties = {

  }

export default class FormSettings extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormSettings, component, {attributes, properties});
