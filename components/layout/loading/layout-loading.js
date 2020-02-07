import Component from '../../../script/Component.js';
import UILoading from '../../ui/loading/ui-loading.js';

const component = Component.meta(import.meta.url, 'layout-loading');
export default class LayoutLoading extends Component {
  constructor() {
    super(component);
  }
}

Component.init(LayoutLoading, component, {});
