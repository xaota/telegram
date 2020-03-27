import { buildInputCheckPasswordSRP } from '../../../script/crypto.js';
import { SEND_PASSWORD } from '../constants.js'
import { setPasswordError, setAuthorizationData } from '../actions.js'
import { setPage } from '../../pages/index.js'

const { isActionOf } = store;
const { from, of, combineLatest } = rxjs;
const { filter, map, mapTo, switchMap, tap, catchError } = rxjs.operators;
const { method, isRpcError, isObjectOf } = zagram;

const getPassword = R.prop('payload');

const isPhoneUnoccupied = isObjectOf('auth.authorizationSignUpRequired');


const getErrorMessage = R.pipe(
  R.prop('errorMessage'),
  R.cond([
    [R.equals('PASSWORD_HASH_INVALID'), R.always('The provided password isn\'t valid')],
    [R.equals('SRP_PASSWORD_CHANGED'), R.always('Password has changed')],
    [R.T, R.identity],
  ]),
);


const handlePasswordResponse = R.cond([
  [isRpcError, R.pipe(getErrorMessage, setPasswordError)],
  [isPhoneUnoccupied, R.partial(setPage, ['sign-up'])],
  [R.T, R.pipe(R.of, R.ap([setAuthorizationData, R.partial(setPage, ['chat'])]))],
]);


function buildGetPassword$(connection, password) {
  return combineLatest(
    of(password),
    from(connection.request(method('account.getPassword')))
  );
}


function checkPassword(connection, inputCheckPasswordSRP) {
  return from(
    connection.request(method('auth.checkPassword', { password: inputCheckPasswordSRP } ))
  ).pipe(catchError(R.of));
}


export default function sendPasswordMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', (e) => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const password$ = action$
        .pipe(filter(isActionOf(SEND_PASSWORD)))
        .pipe(map(getPassword));

      const passwordSettings$ = password$.pipe(
        switchMap(R.partial(buildGetPassword$, [connection])),
        switchMap(R.apply(buildInputCheckPasswordSRP)),
        switchMap(R.partial(checkPassword, [connection])),
      );

      const verifyPassword$ = passwordSettings$

      verifyPassword$.subscribe(handlePasswordResponse);
    }
  });
}
