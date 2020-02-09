import Component from '../../../script/Component.js';

import UIIcon     from '../../ui/icon/ui-icon.js';

const component = Component.meta(import.meta.url, 'form-search');
const attributes = {

  }

const properties = {

  }

export default class FormSearch extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(FormSearch, component, {attributes, properties});
