import Component from '../../../script/Component.js';
import $, {updateChildrenAttribute, updateChildrenHTML} from '../../../script/DOM.js';

import '../loading-percent/ui-percent.js';

const component = Component.meta(import.meta.url, 'ui-file');
const types = {
    pdf: {
        color: '#8C171B',
        bent: '#70000B',
    },
    apk: {
        color: '#389237'
    },
    doc: {
        color: '#418FE3',
        bent: '#2266B6',
    },
    zip: {
        color: '#F87808',
    },
};

const attributes = {
    src(root, value) {
        // в зависимост от типа файла рисуем превью
        const img = $('.img', root);
        img.style.setProperty("--file-color", types.pdf.color);
        img.style.setProperty("--bent-color", types.pdf.bent);
    },
    name(root, value) {
        updateChildrenHTML(root, '.name', value);
    },
    size(root, value) {
        updateChildrenHTML(root, '.size', value);
    },
    date(root, value) {
        updateChildrenHTML(root, '.date', value);
    }
};

const properties = {}

export default class UiFile extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    return super.mount(node, attributes, properties);
  }
}

Component.init(UiFile, component, {attributes, properties});
