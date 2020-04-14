import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-logo');
export default class UILogo extends Component {
  constructor() {
    super(component);
  }
}

Component.init(UILogo, component, {});
