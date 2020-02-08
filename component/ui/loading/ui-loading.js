import Component from '../../../script/Component.js';
const component = Component.meta(import.meta.url, 'ui-loading');

export default class UILoading extends Component {
  constructor() {
    super(component);
  }
}

Component.init(UILoading, component, {});
