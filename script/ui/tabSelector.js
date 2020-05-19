import $ from './DOM.js';

const {fromEvent, from} = rxjs;
const {filter, map, mapTo, mergeAll, startWith, tap} = rxjs.operators;

const notIsNil = R.pipe(R.isNil, R.not);


/**
 * @param {UiTabs} node - that contain tabs
 * @param {Arrary<string>} tabSelectorList - selector of selected tab
 * @param {string} [defaultValue] - default value that should be
 * @returns {Observable<string}>} string of selected
 */
export function tabsSelector(node, tabSelectorList, defaultValue) {
  return from(tabSelectorList)
    .pipe(
      map(selector => [$(selector, node), selector]),
      map(([tabNode, selector]) => fromEvent(tabNode, 'selected')
        .pipe(mapTo(selector))),
      mergeAll(),
      startWith(defaultValue),
      filter(notIsNil),
      tap(selector => {
        R.forEach(x => $(x, node).removeAttribute('selected'), tabSelectorList);
        $(selector, node).setAttribute('selected', true);
      })
    );
}
