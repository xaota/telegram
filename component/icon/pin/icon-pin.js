import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-pin');
export default class IconPin extends Component {
  constructor() {
    super(component);
  }
}

Component.init(IconPin, component, {});
