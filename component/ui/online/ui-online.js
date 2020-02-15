import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenHTML} from '../../../script/DOM.js';

const component = Component.meta(import.meta.url, 'ui-online');
const attributes = {
    status(root, value) {
        if (value === 'online') {
            updateChildrenAttribute(root, '#status', 'class', 'online');
            updateChildrenHTML(root, '#status', value);
        } else {
            updateChildrenHTML(root, '#status', generateTime(+value));
        }
    },
};

const properties = {}

export default class UiOnline extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UiOnline, component, {attributes, properties});

function generateTime(time) {
    return 'TODO DATE';
    const date = time * 1000;
    const now = new Date();
    const day = now.getDay();
    const year = now.getFullYear();
    now.setTime(date);
    let dateDay = now.getDay();
    let dateYear = now.getFullYear();
    if (dateDay === day && year === dateYear) {

    } else if (dateDay + 1 == day && year == dateYear) {
    } else if (Math.abs(+(new Date()) - date) < 31536000000) {

    } else {

    }
}
