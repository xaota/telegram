import {AUTH_SEND_CODE} from '../constants.js';
import {sendAuthCodeError, sendAuthCodeSuccess} from '../actions.js';
import {setPage} from '../../pages/index.js';
// import {config} from '../../../tdweb/Telegram.js';
import config from '../../../script/app/config.js';

const fromPromise = rxjs.from;
const {
  catchError,
  filter,
  mergeMap,
  map,
  withLatestFrom
} = rxjs.operators;

const {method, construct, isMessageOf} = zagram;
const {isActionOf} = store;

const sendAuthMethod = R.partial(method, ['auth.sendCode']);

const baseAuthData = {
  // ...config,
  api_id: config.api.id,
  api_hash: config.api.hash,
  settings: construct('codeSettings', {})
};

const sendAuthCode = R.pipe(
  R.set(R.lensProp('phone_number'), R.__, baseAuthData),
  sendAuthMethod
);

const mergeResponseWithPhone = R.pipe(
  R.reverse,
  R.apply(R.set(R.lensProp('phone')))
);

const handleSuccess = R.pipe(
  mergeResponseWithPhone,
  R.of,
  R.ap([sendAuthCodeSuccess, R.partial(setPage, ['verify'])])
);
const handleError = R.pipe(
  R.nth(0),
  R.prop('errorMessage'),
  sendAuthCodeError
);

const handleResponseWithPhone = R.pipe(R.cond([
    [R.pipe(R.nth(0), isMessageOf('rpc_error_type')), handleError],
    [R.T, handleSuccess]
  ]));

const getPhone = R.prop('payload');

/**
 * @param action$ - stream of actions
 * @param state$ - stream of application state
 * @param {*} connection  - mtproto connection object
 */
export default function sendAuthMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', e => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const sendAuthRequestStream = R.pipe(
        getPhone,
        sendAuthCode,
        x => connection.request(x),
        fromPromise
      );

      const sendAuth$ = action$.pipe(filter(isActionOf(AUTH_SEND_CODE)));
      const authPhone$ = sendAuth$.pipe(map(getPhone));
      const sendAuthResponse$ = sendAuth$.pipe(mergeMap(x => sendAuthRequestStream(x).pipe(catchError(R.of))));

      sendAuthResponse$
        .pipe(withLatestFrom(authPhone$))
        .subscribe(handleResponseWithPhone);
    }
  });
}
