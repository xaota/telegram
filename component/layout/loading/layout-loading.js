import Component from '../../../script/Component.js';

/* eslint-disable */
import UILoading from '../../ui/loading/ui-loading.js';
/* eslint-enable */

const component = Component.meta(import.meta.url, 'layout-loading');
export default class LayoutLoading extends Component {
  constructor() {
    super(component);
  }
}

Component.init(LayoutLoading, component, {});
