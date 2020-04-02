import Component from '../../../script/Component.js';

/* eslint-disable */
import UIFAB      from '../../ui/fab/ui-fab.js';
import UIInput    from '../../ui/input/ui-input.js';
import UIHeader   from '../../ui/header/ui-header.js';
import UIFieldset from '../../ui/fieldset/ui-fieldset.js';
import AvatarEdit from '../../app/avatar-edit/avatar-edit.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'form-settings');
const attributes = {

  };

const properties = {

  };

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
