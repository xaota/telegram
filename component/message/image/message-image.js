import Component from '../../../script/Component.js';
import UILoading from '../../ui/loading/ui-loading.js';

const component = Component.meta(import.meta.url, 'message-image');
const attributes = {}
const properties = {}

export default class MessageImage extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }
}

Component.init(MessageImage, component, {attributes, properties});
