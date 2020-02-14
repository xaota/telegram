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
      root: null,
      rootMargin: '50px',
      threshold: 1,
    };

    let observer = new IntersectionObserver((changes, observer) => {
      changes.forEach(change => {
        if (change.intersectionRatio > 0) {
          this.event('list-overscroll', {up: true});
          // observer.unobserve(change.target);
        }
      });
    }, options);
    const div = document.createElement('div')
    setTimeout(() => {
      this.shadowRoot.appendChild(div);
    }, 3000); // TODO дикий костыль, считаем что дочерние элементы отрендерятся, иначе лишний раз отрабатывает событие
    observer.observe(div);
    return this;
  }
}

Component.init(UIList, component, {attributes, properties});
