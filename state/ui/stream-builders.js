const {map} = rxjs.operators;

/**
 * @param {Observable<*>} state$ - current state of application
 * @return {Observable<boolean>} - stream to indicate is sidebar open or not
 */
export function getSidebarStatus$(state$) {
  return state$.pipe(map(R.pathOr(false, ['ui', 'sidebar'])));
}

/**
 * @param {Observable<*>} state$ - current state of application
 * @return {Observable<boolean>} - stream to indicate is sidebar open or not
 */
export function getSearchbarStatus$(state$) {
  return state$.pipe(map(R.pathOr(false, ['ui', 'searchbar'])));
}

/**
 * @param {Observable<*>} state$ - current state of application
 * @return {Observable<*|null>} - stream with splash screen message or null
 */
export function getSplashScreenMessage$(state$) {
  return state$.pipe(map(R.pathOr(null, ['ui', 'splashScreenMessage'])));
}
