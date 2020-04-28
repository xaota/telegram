const {map} = rxjs.operators;

/**
 * @param {Observable<*>} state$ - current state of application
 * @return {Observable<boolean>} - stream to indicate is sidebar open or not
 */
export function getSidebarStatus$(state$) {
  return state$.pipe(map(R.pathOr(false, ['ui', 'sidebar'])));
}
