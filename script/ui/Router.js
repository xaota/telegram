import {removeChildrens} from './DOM.js';

/** {Router} Роутинг и HistoryApi @class @export @default
  * @property {object} routes список роутов
  */
  export default class Router {
  /** {Router} Роутинг в приложении @constructor
    */
    constructor(root = document.body, handler = Router.replaceNodeRouter) {
      this.root    = root;
      this.handler = handler;
      this.routes  = {}; // @todo: []
      this.default = '';
    }

  /** */
    check(...args) {
      const candidates = Object
        .keys(this.routes)
        .map(name => ({
            name,
            check: this.routes[name]?.check?.(this.routes[name], ...args) || false
          }))
        .filter(item => item.check)
        .map(item => item.name);

      const component = candidates[0] || this.default;
      if (!component) return;
      this.handler(this, this.routes[component], ...args);
    }

  /** */
    route(component) {
      this.routes[component.name] = component;
      if (component.default) this.default = component.name;
      return this;
    }

  /** */
    static nameCheck(route, location) {
      return route.name === location;
    }

  /** */
    static constructorHandler(constructor, skip = 1) {
      return (...args) => new constructor(...args.slice(skip));
    }

  /** */
    static callbackSkip(callback, skip = 2) {
      return (element, ...args) => callback(element, ...args.slice(skip));
    }

  /**
    * @param {Router} instance
    * @param {object} component
    */
    static replaceNodeRouter(instance, component, ...args) {
      const parent = instance.root;
      removeChildrens(parent);
      if (!component) return;
      const element = component.handler
        ? component.handler(...args)
        : document.createElement(component.name);
      parent.append(element);
      component?.callback?.(element, ...args);
    }
  }

