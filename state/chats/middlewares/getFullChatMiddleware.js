import {isAuthKeyCreated, requestToTelegram$} from '../../utils.js';

import {GET_FULL_CHAT} from '../constants.js';
import {setFullChat, setChatList} from '../actions.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';
import {setUserList} from '../../users/index.js';

const {fromEvent} = rxjs;
const {map, filter, switchMapTo, switchMap} = rxjs.operators;

const {isActionOf} = store;
const {isObjectOf, isRpcError, method} = zagram;

const buildFullChannelRequestMethod = R.pipe(
  wrapAsObjWithKey('channel'),
  R.partial(method, ['channels.getFullChannel'])
);

const buildFullChatRequestMethod = R.partial(method, ['messages.getFullChat']);

const buildRequestMethod = R.cond([
  [isObjectOf('inputPeerChannel'), buildFullChannelRequestMethod],
  [R.T, buildFullChatRequestMethod]
]);

const handleSuccessResponse = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('users'), setUserList),
    R.pipe(R.prop('chats'), setChatList),
    R.pipe(R.prop('full_chat'), setFullChat)
  ])
);

const handleResponse = R.cond([
  [isRpcError, console.warn],
  [R.T, handleSuccessResponse]
]);

export default function getFullChatMiddleware(action$, state$, connection) {
  const sendRequest$ = R.partial(requestToTelegram$, [connection]);
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const getFullChatAction$ = authKeyCreated$
    .pipe(
      switchMapTo(action$),
      filter(isActionOf(GET_FULL_CHAT)),
      map(R.prop('payload')),
      filter(R.pipe(R.isNil, R.not)),
      map(buildRequestMethod),
      switchMap(sendRequest$)
    );

  getFullChatAction$.subscribe(handleResponse);
}
