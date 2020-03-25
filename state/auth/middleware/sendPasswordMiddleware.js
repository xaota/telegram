import { SEND_PASSWORD } from '../constants.js'
import { setPasswordError } from '../actions.js'

const { isActionOf } = store;
const { catchError, filter, map, mergeMap, withLatestFrom, delay } = rxjs.operators;

const getPassword = R.prop('payload');

const handlePasswordResponse = setPasswordError;

export default function sendPasswordMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', (e) => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const password$ = action$
        .pipe(filter(isActionOf(SEND_PASSWORD)))
        .pipe(map(getPassword));

      const verifyPassword$ = password$.pipe(delay(2000));

      verifyPassword$.subscribe(handlePasswordResponse);
    }
  });
}
