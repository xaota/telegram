const {map, distinctUntilChanged} = rxjs.operators;

/**
 * @param {Observable<*>} state$ - stream of current state
 * @return {Observable<*>} stream of authorizaed user;
 */
export function authorizedUser$(state$) {
  return state$.pipe(
    map(R.pathOr(null, ['auth', 'user'])),
    distinctUntilChanged()
  );
}
