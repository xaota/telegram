import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';
const component = Component.meta(import.meta.url, 'ui-list');
const attributes = {

  }

const properties = {

  }

export default class UIList extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    let options = {
      root: this,
      rootMargin: '0px',
      threshold: 1,
    };

    let observer = new IntersectionObserver((changes, observer) => {
      changes.forEach(change => {
        if (change.intersectionRatio > 0) {
          // console.log(3, change.target);
          // observer.unobserve(change.target);
        }
      });
    }, options);
    observer.observe($('#end', node));
    return this;
  }
}

Component.init(UIList, component, {attributes, properties});
