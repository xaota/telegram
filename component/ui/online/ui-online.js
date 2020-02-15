import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenHTML, channel} from '../../../script/DOM.js';
import dateFormat from '../../../script/date.js';

const component = Component.meta(import.meta.url, 'ui-online');
const attributes = {
    status(root, value) {
        if (value === 'online') {
            updateChildrenAttribute(root, '#status', 'class', 'online');
            updateChildrenHTML(root, '#status', value);
        } else {
            if (value && value !== 'undefined') {
                const text = getText(value);
                updateChildrenHTML(root, '#status', text);
            }
        }
    },
    id(root, value) {
        if (value) {
            this.id = +value;
        }
    },
};

const properties = {}

export default class UiOnline extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    channel.on('user.status', (e) => {
        if (e.user_id === +this.id) {
            if (e.online) {
                $('#status', node).setAttribute('class', 'status online');
                updateChildrenHTML(node, '#status', 'online');
            } else {
                const text = getText(e.was_online);
                $('#status', node).setAttribute('class', 'status');
                updateChildrenHTML(node, '#status', text);
            }
        }
    });
    return super.mount(node, attributes, properties);
  }
}

function getText(was_online) {
    const now = new Date();
    const online = new Date(was_online * 1000);
    if (online > now) {
        return 'last seen just now';
    }

    let diff = new Date(now - online);
    if (diff.getTime() / 1000 < 60) {
        return 'last seen just now';
    }

    if (diff.getTime() / 1000 < 60 * 60) {
        const minutes = Math.floor(diff.getTime() / 1000 / 60);
        return `last seen ${minutes === 1 ? '1 minute' : minutes + ' minutes'} ago`;
    }

    // today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (online > today) {
        // up to 6 hours ago
        if (diff.getTime() / 1000 < 6 * 60 * 60) {
            const hours = Math.floor(diff.getTime() / 1000 / 60 / 60);
            return `last seen ${hours === 1 ? '1 hour' : hours + ' hours'} ago`;
        }

        // other
        return `last seen today at ${dateFormat(online, 'H:MM')}`;
    }

    // yesterday
    let yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    if (online > yesterday) {
        return `last seen yesterday at ${dateFormat(online, 'H:MM')}`;
    }

    return `last seen ${dateFormat(online, 'dd.mm.yyyy')}`;
};
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
