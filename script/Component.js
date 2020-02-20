import Template from './Template.js';

const store = Symbol('store');
const state = Symbol('state');

export default class Component extends HTMLElement {
  constructor(component, mode = 'open') {
    super();
    this[store] = null;
    this[state] = 'created';
    this.attachShadow({mode});
    this.component = component;
  }

/** state @readonly */
  get state() {
    return this[state];
  }

/** store */
  store(...data) { // component.store({что-то}) - запись, store = component.store() - чтение
    if (data.length === 0) return this[store] || {};

    this[store] = data.length === 1 && data[0] === null
      ? null
      : Object.assign({}, this[store], ...data);

    return this.state === 'mounted'
      ? this.render(this.shadowRoot)
      : this;
  }

/** event */
  event(event, detail = null) { // Отправка событий во внешний DOM // component.event('custom-event', {data: value})
    const options = {bubbles: true, composed: true};
    event = detail !== null || (!event.type && event.includes('-'))
      ? new CustomEvent(event, {detail, ...options})
      : typeof event === 'object' ? event : new Event(event);
    return this.dispatchEvent(event);
  }

/** connectedCallback */
  async connectedCallback() { // не юзать напрямую
    if (!this.ownerDocument.defaultView) return; // !
    if (this.shadowRoot.firstChild) return; // ! loaded @TODO: перенос узла

    const template = await Template(this.component); // шаблон @TODO: сборка
    this
      .ready(template)
      .attach(template)
      .mount(this.shadowRoot);

    this[state] = 'mounted';
    if (this[store]) this.render(this.shadowRoot);
    this.event('DOMContentLoaded');
  }

/** disconnectedCallback */
  disconnectedCallback() { // удаление элемента из DOM
    this.unmount();
    this[state] = 'unmounted';
    // this.event('unload?');
    // if (!this.ownerDocument.defaultView) return; // !
    // полное удаление
    // const root = this.shadowRoot;
    // while (root.firstChild) root.removeChild(root.firstChild);
  }

/** ready */
  ready(template) { // доступ к фрагмменту перед вставкой в DOM (если нужно)
    return this;
  }

/** attach */
  attach(template) { // вставка фрагмента в DOM
    this.shadowRoot.appendChild(template);
    return this;
  }

/** Создание элемента в DOM (DOM доступен) / mount @lifecycle
  * @param {HTMLElement} node ShadowRoot узел элемента
  * @param {object} attributes функции, вызываемые при изменении отслеживаемых атрибутов
  * @return {Component} @this
  */
  mount(node, attributes = {}, properties = {}) { // самая ходовая функция, вешать внуренние события здесь и т д (может быть недоступен shadowRoot дочерних веб-компонент)
    Object
      .keys(attributes)
      .forEach(attribute => attributes[attribute].call(this, node, this[attribute]));
    Object
      .keys(properties)
      .forEach(property => properties[property].call(this, node, this[property]));
    return this;
  }

/** render */
  render(node, previous) { // перерендеринг компонента, если требуется
    return this;
  }

/** unmount */
  unmount() { // тут типа можно отписаться от событий, но вроде пофиг
    return this;
  }

/** is @static */
  static is(component, ...constructors) { // Является ли узел элементом определенного класса
    if (typeof component !== 'object') component = document.createElement(component);
    const is = constructor => constructor
      ? component instanceof constructor
      : Object.getPrototypeOf(component.constructor) !== HTMLElement && component.constructor !== HTMLElement;
    return constructors.some(is);
  }

/** define @static */
  static define({name}, constructor, options = undefined) { // сохраняет привязку класса-компонента к html-тегу
    if (Component.exist(name)) return;
    window.customElements.define(name, constructor, options);
  }

/** exist @static */
  static exist(component) { // проверка существования привязки
    return Boolean(customElements.get(component));
  }

/** defined @static */
  static defined(components = []) { // шляпа
    return Promise.all(components.map(e => customElements.whenDefined(e)));
  }

/** meta @static */
  static meta(base, name, href = './index.html') {
    return {name, href, base};
  }

/** properties @static */
  static properties(constructor, ...list) { // навешивает свойства (boolean) элемента + геттеры и сеттеры
    list.forEach(property => setProperty(constructor.prototype, property));
  }

/** attributes @static */
  static attributes(constructor, ...list) { // навешивает атрибуты (string) элемента + геттеры и сеттеры
    list.forEach(attribute => setAttribute(constructor.prototype, attribute));
  }

/** init @static */
  static init(constructor, component, {attributes = {}, properties = {}}) { // сокращенная инициализация компонента
    const fields = [...Object.keys(attributes), ...Object.keys(properties)];

    Object.defineProperties(constructor, {
      observedAttributes: {
        get: () => fields,
        enumerable: false
      },
      is: {
        value: node => Component.is(node, constructor),
        enumerable: false
      }
    });

    Object.defineProperty(constructor.prototype, 'attributeChangedCallback', {
      value(name, previous, current) {
        const root = this.shadowRoot;
        if (current === previous) return;
        if (name in attributes) attributes[name].call(this, root, current, previous);
        if (name in properties) properties[name].call(this, root, current, previous);
      }
    });

    Component.attributes(constructor, ...Object.keys(attributes));
    Component.properties(constructor, ...Object.keys(properties));
    Component.define(component, constructor);
  }
}

// #region [Private]
  function setAttribute(prototype, attribute) {
    Object.defineProperty(prototype, attribute, {
      get() { return this.getAttribute(attribute) },
      set(value) {
        value === null
          ? this.removeAttribute(attribute)
          : this.setAttribute(attribute, value);
      }
    });
  }

  function setProperty(prototype, property) {
    Object.defineProperty(prototype, property, {
      get() { return this.hasAttribute(property) },
      set(value) {
        value === false // null?
          ? this.removeAttribute(property)
          : this.setAttribute(property, '');
      }
    });
  }
// #endregion
