const {map} = rxjs.operators;

/**
 * @param {Observable<*>} state$ - stream of state
 * @param {Number} userId - id of user to select
 * @returns {Observable}  - observe user with this id
 */
export function getUser$(state$, userId) {
  return state$.pipe(map(R.path(['users', R.toString(userId)])));
}
