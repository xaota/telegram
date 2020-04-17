import Component, {html, css} from '../../script/ui/Component.js';
// import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    display: block;
    overflow: hidden;
  }

  slot {
    height: 100%;
    overflow: auto;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  :host([bottom]) slot {
    flex-direction: column-reverse;
    /* justify-content: flex-end; */
  }`;

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
      </template>`;

  // /** Создание компонента {UIList} @constructor
  //   * @param {string?} name название иконки
  //   */
  //   constructor(name) {
  //     super();
  //     if (name) this.innerText = name;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {UIList} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      // const options = {
      //   root: null,
      //   rootMargin: '50px',
      //   threshold: 1
      // };

      // const observer = new IntersectionObserver((changes, observer) => {
      //   changes.forEach(change => {
      //     if (change.intersectionRatio > 0) {
      //       this.event('list-overscroll', {up: true});
      //       // observer.unobserve(change.target);
      //     }
      //   });
      // }, options);
      // const div = document.createElement('div');
      // setTimeout(() => {
      //   this.shadowRoot.appendChild(div);
      // }, 3000); // TODO дикий костыль, считаем что дочерние элементы отрендерятся, иначе лишний раз отрабатывает событие
      // observer.observe(div);
      return this;
    }
  }

Component.init(UIList, 'ui-list', {attributes, properties});
