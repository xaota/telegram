import { SIGN_UP } from '../constants.js';
import { setAuthorizationData, signUpError } from '../actions.js';
import { setPage } from '../../pages/index.js';

const fromPromise = rxjs.from;
const { catchError, filter, map, mergeMap, withLatestFrom, } = rxjs.operators
const { isActionOf } = store;
const { method, isMessageOf } = zagram;

const methodSignUp = R.partial(method, ['auth.signUp']);

const getFirstNameFromAction = R.pipe(
  R.path(['payload', 'firstName']),
  R.set(R.lensProp('first_name'), R.__, {}),
);

const getLastNameFromAction = R.pipe(
  R.path(['payload', 'lastName']),
  R.set(R.lensProp('last_name'), R.__, {}),
);

const getSignUpNames = R.pipe(
  R.of,
  R.ap([getFirstNameFromAction, getLastNameFromAction]),
  R.mergeAll,
);

const getPhoneNumberFromState = R.pipe(
  R.path(['auth', 'currentPhone']),
  R.set(R.lensProp('phone_number'), R.__, {}),
);

const getPhoneCodeHashFromState = R.pipe(
  R.path(['auth', 'phoneCodeHash']),
  R.set(R.lensProp('phone_code_hash'), R.__, {}),
);

const getAuthDataFromState = R.pipe(
  R.of,
  R.ap([getPhoneNumberFromState, getPhoneCodeHashFromState]),
  R.mergeAll,
);

const handleResponseError = R.pipe(
  R.prop('errorMessage'),
  signUpError,
);

const handleResponseSuccess = R.pipe(
  R.of,
  R.ap([setAuthorizationData, R.partial(setPage, ['chat'])]),
);

const handleSignUpResponse = R.cond([
  [isMessageOf('rpc_error_type'), handleResponseError],
  [R.T, handleResponseSuccess],
]);

export default function signUpMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', (e) => {
    if (e.status === 'AUTH_KEY_CREATED') {
      console.log('Init sign up middleware');
      const signUpNames$ = action$
        .pipe(filter(isActionOf(SIGN_UP)))
        .pipe(map(getSignUpNames));

      const authData$ = state$
        .pipe(map(getAuthDataFromState));

      const signUp$ = signUpNames$
        .pipe(withLatestFrom(authData$))
        .pipe(map(R.mergeAll))
        .pipe(map(methodSignUp))
        .pipe(mergeMap((x) => fromPromise(connection.request(x)).pipe(catchError(R.of))));

      signUp$.subscribe(handleSignUpResponse);
    }
  });
}
