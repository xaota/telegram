import {setPage} from '../../pages/index.js';
import {VERIFY_CODE} from '../constants.js';
import {sendVerifyCodeError, setAuthorizationData} from '../actions.js';

const fromPromise = rxjs.from;
const {isActionOf} = store;
const {catchError, filter, map, mergeMap, withLatestFrom} = rxjs.operators;
const {method, isMessageOfType, isObjectOf} = zagram;

const sendSignIn = R.partial(method, ['auth.signIn']);

/**
 * Selector to get phone_number from state
 * @params {*} state - application state
 * @returns {{phone_number: string, phone_code_hash: string }}
 */
const getPhoneCodeHash = R.pipe(
  R.path(['auth', 'phoneCodeHash']),
  R.set(R.lensProp('phone_code_hash'), R.__, {})
);

/**
 * Selector to get phone_number from state
 * @params {*} state - application state
 * @returns {{phone_number: string, phone_code_hash: string }}
 */
const getPhoneNumber = R.pipe(
  R.path(['auth', 'currentPhone']),
  R.set(R.lensProp('phone_number'), R.__, {})
);

/**
 * Selector to get phone_number, phone_code_hash from state
 * @params {*} state - application state
 * @returns {{phone_number: string, phone_code_hash: string }}
 */
const getPhoneData = R.pipe(
  R.of,
  R.ap([getPhoneNumber, getPhoneCodeHash]),
  R.mergeAll
);

const getPhoneCode = R.pipe(
  R.prop('payload'),
  R.set(R.lensProp('phone_code'), R.__, {})
);


const isPhoneUnoccupied = isObjectOf('auth.authorizationSignUpRequired');

const handleVerifyError = R.pipe(
  R.prop('errorMessage'),
  R.cond([
    [R.equals('SESSION_PASSWORD_NEEDED'), R.partial(setPage, ['password'])],
    [R.T, sendVerifyCodeError]
  ])
);

const handleVerifyResponse = R.cond([
  [isPhoneUnoccupied, R.partial(setPage, ['sign-up'])],
  [isMessageOfType('rpc_error_type'), handleVerifyError],
  [R.T, R.pipe(R.of, R.ap([setAuthorizationData, R.partial(setPage, ['chat'])]))]
]);

/**
 * @param action$ - stream of actions
 * @param state$ - stream of application state
 * @param {*} connection  - mtproto connection object
 */
export default function sendVerifyCodeMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', e => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const phoneData$ = state$.pipe(map(getPhoneData));
      const verifyCode$ = action$
        .pipe(filter(isActionOf(VERIFY_CODE)))
        .pipe(map(getPhoneCode));

      const sendSignIn$ = verifyCode$
        .pipe(withLatestFrom(phoneData$))
        .pipe(map(R.mergeAll))
        .pipe(map(sendSignIn));

      sendSignIn$
        .pipe(mergeMap(x => fromPromise(connection.request(x)).pipe(catchError(R.of))))
        .subscribe(handleVerifyResponse);
    }
  });
}
