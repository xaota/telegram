import {setAuthorizationData} from '../actions.js';
import {setPage} from '../../pages/index.js';
import config from '../../../script/app/config.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';
import {isAuthKeyCreated} from '../../utils.js';

const {of, from, fromEvent} = rxjs;
const {map, filter, switchMap, catchError, tap, mapTo} = rxjs.operators;
const {method, construct} = zagram;

function initConnection$(connection, x) {
  console.log('[INIT CONNECTION] initConnection$', x);
  const initConnectionRequestData = method(
    'invokeWithLayer',
    {
      layer: 108,
      query: method(
        'initConnection',
        {
          api_id: config.api.id,
          query: method('help.getConfig'),
          ...config.app
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
      map(R.pipe(R.prop('user'), wrapAsObjWithKey('user'))),
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
