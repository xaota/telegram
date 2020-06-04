import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: flex;
    overflow: auto;
    flex-direction: column;
    height: 0px;
    flex-grow: 1;
  }

  slot {
    display: flex;
    flex-direction: column;
  }

  :host([bottom]) slot {
    flex-direction: column-reverse;
    /* justify-content: flex-end; */
  }
  
  .load-more {
    flex-shrink: 0;
    height: 30px;
    background: #ff0000;
    opacity: 0;
  }
`;

const attributes = {};
const properties = {};

/** {UIList} @class
  * @description Отображение списка элементов
  */
  export default class UIList extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <slot></slot>
        <div class="load-more"></div>
      </template>`;

  // /** Создание компонента {UIList} @constructor
  //   * @param {string?} name название иконки
  //   */
  //   constructor(name) {
  //     super();
  //     if (name) this.innerText = name;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {UIList} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const options = {
        root: $(':host', node),
        rootMargin: '0px',
        threshold: 1.0
      };

      const observer = new IntersectionObserver((changes, observer) => {
        console.log('load more node');
        this.event('load-more');
      }, options);

      const loadMoreNode = $('.load-more', node);
      observer.observe(loadMoreNode);
      return this;
    }
  }

Component.init(UIList, 'ui-list', {attributes, properties});
