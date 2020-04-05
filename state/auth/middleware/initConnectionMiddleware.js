import {setAuthorizationData} from '../actions.js';
import {setPage} from '../../pages/index.js';
import {config} from '../../../tdweb/Telegram.js';

const {of, from, fromEvent} = rxjs;
const {map, filter, switchMap, catchError, tap, mapTo} = rxjs.operators;
const {method, construct} = zagram;

const isAuthKeyCreated = R.pipe(
  R.prop('status'),
  R.equals('AUTH_KEY_CREATED')
);

const hasUser = R.has('user');

function initConnection$(connection, x) {
  console.log('[INIT CONNECTION] initConnection$', x);
  const initConnectionRequestData = method(
    'invokeWithLayer',
    {
      layer: 108,
      query: method(
        'initConnection',
        {
          api_id: config.api_id,
          device_model: navigator.userAgent,
          system_version: navigator.platform,
          app_version: '0.0.1',
          system_lang_code: navigator.language,
          lang_pack: '',
          lang_code: 'ru-ru',
          query: method('help.getConfig')
        }
      )
    }
  );
  return from(connection.request(initConnectionRequestData));
}

function getSelfUser$(connection, x) {
  console.log('[INIT CONNECTION] getSelfUser$', x);
  const requestData = method(
    'users.getFullUser',
    {id: construct('inputUserSelf')}
  );

  return from(connection.request(requestData)).pipe(catchError(R.of));
}

/**
 * sets users data to store then
 */
function chatPage$(userData) {
  console.log(userData);

  return of(userData)
    .pipe(
      map(R.prop('user')),
      tap(setAuthorizationData),
      mapTo('chat')
    );
}

function loginPage$() {
  return of('login');
}


export default function initConnectionMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));


  const initApi$ = authKeyCreated$
    .pipe(switchMap(R.partial(initConnection$, [connection])));

  const selfUser$ = initApi$
    .pipe(switchMap(R.partial(getSelfUser$, [connection])));

  const initialPage$ = selfUser$.pipe(switchMap(R.cond([
      [R.has('user'), chatPage$],
      [R.T, loginPage$]
    ])));

  initialPage$.subscribe(setPage);
}
