import Component from '../../../script/Component.js';

/* eslint-disable */
import FormConfirm  from '../../form/confirm/form-confirm.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'layout-confirm');
const attributes = {

  };

const properties = {

  };

export default class LayoutConfirm extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    return this;
  }
}

Component.init(LayoutConfirm, component, {attributes, properties});
