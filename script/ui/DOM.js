// @todo:

/** Выбор элемента DOM
  * @param {string|HTMLElement} selector селектор
  * @param {HTMLElement|Document} root? корень поиска
  * @return {HTMLElement|null}
  */
  export default function $(selector, root = document) {
    return typeof selector === 'object'
      ? selector
      : root.querySelector(selector);
  }

/** */
  export function updateChildrenElement(root, selector, attribute, value) {
    const children = $(selector, root);
    if (!children) return;
    children[attribute] = value || '';
  }

/** */
  export function updateChildrenAttribute(root, selector, attribute, value) {
    const children = $(selector, root);
    if (!children) return;
    const remove = value === null || value === false;
    remove
      ? children.removeAttribute(attribute)
      : children.setAttribute(attribute, value);
    if (children[attribute] && !remove) children[attribute] = value;
  }

/**
  * @param {string|boolean|any} value значение свойства элелмента
  */
  export function updateChildrenProperty(root, selector, property, value = false) {
    const children = $(selector, root);
    if (!children) return;
    value === '' || Boolean(value)
      ? children.setAttribute(property, '')
      : children.removeAttribute(property);
  }

/** */
  export function updateChildrenHTML(root, selector, value = '') {
    const children = $(selector, root);
    if (!children) return;
    children.innerHTML = value;
  }

/** */
  export function updateChildrenText(root, selector, value = '') {
    const children = $(selector, root);
    if (!children) return;
    children.innerText = value;
  }

/** */
  export function updateChildrenClass(root, selector, value = {}) {
    const children = $(selector, root);
    if (!children) return;
    Object.keys(value).forEach(c => children.classList[value[c] ? 'add' : 'remove'](c));
  }

/** */
  export function cssVariable(element, name, value) {
    if (name.charAt(0) !== '-') name = '--' + name;
    if (value) element.style.setProperty(name, value);
    return getComputedStyle(element).getPropertyValue(name);
  }

/** */
  export function pointerOffset(element, event) {
    const target = event.target;
    const root   = element.getBoundingClientRect();
    const host   =  target.getBoundingClientRect();
    return {
      x: event.offsetX + (host.left - root.left),
      y: event.offsetY + (host.top  - root.top)
    };
  }

/** */
  export function removeChildrens(parent) {
    if (!parent) return;
    while (parent.firstChild) parent.firstChild.remove();
    return parent;
  }
