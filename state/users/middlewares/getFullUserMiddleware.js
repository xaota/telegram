import {isAuthKeyCreated, requestToTelegram$} from '../../utils.js';

import {GET_FULL_USER} from '../constants.js';
import {setFullUser} from '../actions.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';

const {fromEvent} = rxjs;
const {map, filter, switchMapTo, switchMap} = rxjs.operators;

const {isActionOf} = store;
const {isRpcError, method} = zagram;

const buildRequestMethod = R.pipe(
  wrapAsObjWithKey('id'),
  R.partial(method, ['users.getFullUser'])
);

const handleSuccessResponse = R.pipe(setFullUser);

const handleResponse = R.cond([
  [isRpcError, console.warn],
  [R.T, handleSuccessResponse]
]);

export default function getFullUserMiddleware(action$, state$, connection) {
  const sendRequest$ = R.partial(requestToTelegram$, [connection]);
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const getFullChatAction$ = authKeyCreated$
    .pipe(
      switchMapTo(action$),
      filter(isActionOf(GET_FULL_USER)),
      map(R.prop('payload')),
      map(buildRequestMethod),
      switchMap(sendRequest$)
    );

  getFullChatAction$.subscribe(handleResponse);
}
