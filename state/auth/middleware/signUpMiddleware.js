import { SIGN_UP } from '../constants.js';
import { setAuthorizationData, signUpError } from '../actions.js';
import { setPage } from '../../pages/index.js';

const fromPromise = rxjs.from;
const { of, from, combineLatest } = rxjs;
const { catchError, filter, map, mergeMap, withLatestFrom, tap, switchMap} = rxjs.operators
const { isActionOf } = store;
const { method, isMessageOf, isRpcError, construct } = zagram;

const methodSignUp = R.partial(method, ['auth.signUp']);
const methodUploadProfilePhoto = R.partial(method, ['photos.uploadProfilePhoto']);

const buildUploadPhotoObject = R.pipe(
  R.set(R.lensProp('file'), R.__, {}),
)

const getFirstNameFromAction = R.pipe(
  R.path(['payload', 'firstName']),
  R.set(R.lensProp('first_name'), R.__, {}),
);

const getLastNameFromAction = R.pipe(
  R.path(['payload', 'lastName']),
  R.set(R.lensProp('last_name'), R.__, {}),
);

const getAvatar = R.pipe(
  R.path(['payload', 'avatar']),
  R.set(R.lensProp('avatar'), R.__, {}),
);

const getSignUpNames = R.pipe(
  R.of,
  R.ap([getFirstNameFromAction, getLastNameFromAction, getAvatar]),
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
  [isRpcError, handleResponseError],
  [R.T, handleResponseSuccess],
]);

const hasAvatar = R.pipe(
  R.propOr(null, 'avatar'),
  Boolean,
);

function signUpWithoutAvatar(connection, data) {
  return of(data).pipe(
    map(methodSignUp),
    switchMap(
      (x) => fromPromise(connection.request(x)).pipe(catchError(R.of))
    ),
  );
}

function uploadAvatar(connection, avatar) {
  return fromPromise(connection.upload(avatar, console.log))
    .pipe(
      map(buildUploadPhotoObject),
      map(methodUploadProfilePhoto),
      switchMap(
        (x) => fromPromise(connection.request(x))
      ),
      catchError(R.of)
    );
}

function signUpWithAvatar(connection, data) {
  return signUpWithoutAvatar(connection, data)
    .pipe(
      switchMap(R.cond([
        [isRpcError, of],
        [
          R.T,
          (x) => combineLatest(of(x), uploadAvatar(connection, data.avatar)).pipe(map(R.nth(0)))
        ],
      ])),
    );
}


export default function signUpMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', (e) => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const signUpNames$ = action$
        .pipe(filter(isActionOf(SIGN_UP)))
        .pipe(map(getSignUpNames));

      const authData$ = state$
        .pipe(map(getAuthDataFromState));

      const signUp$ = signUpNames$
        .pipe(
          withLatestFrom(authData$),
          map(R.mergeAll),
          mergeMap(
            R.cond([
              [hasAvatar, R.partial(signUpWithAvatar, [connection])],
              [R.T, R.partial(signUpWithoutAvatar, [connection])],
            ]),
          ),
        );

      signUp$.subscribe(handleSignUpResponse);
    }
  });
}
