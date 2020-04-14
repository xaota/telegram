import Component from '../../../script/Component.js';

/* eslint-disable */
import UIRadio from '../../ui/radio/ui-radio.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'form-language');
const attributes = {

  };

const properties = {

  };

export default class FormLanguage extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormLanguage, component, {attributes, properties});
