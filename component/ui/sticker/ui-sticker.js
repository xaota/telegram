import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'ui-sticker');
export default class UISticker extends Component {
  constructor() {
    super(component);
  }
}

Component.init(UISticker, component, {});
