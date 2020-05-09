import {SEND_MESSAGE} from '../constants.js';
import {prependMessage} from '../actions.js';
import {isAuthKeyCreated, requestToTelegram$, applyAll, inputPeerToPeer} from '../../utils.js';
import {getRandomBigInt} from '../../../script/crypto.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';
import {authorizedUser$} from '../../auth/stream-builders.js';

const {of, fromEvent, combineLatest} = rxjs;
const {map, filter, switchMap, switchMapTo} = rxjs.operators;
const {isActionOf} = store;
const {method, isObjectOf, construct} = zagram;


function attachRandomId(x) {
  return {random_id: getRandomBigInt(8), ...x};
}

const buildRequest = R.pipe(
  attachRandomId,
  R.partial(method, ['messages.sendMessage'])
);

const isShortUpdate = isObjectOf('updateShortSentMessage');

const isResponseHasShortUpdate = R.pipe(R.nth(1), isShortUpdate);

const getRequest = R.nth(0);
const getResponse = R.nth(1);
const getAuthorizedUser = R.nth(2);

const buildMessageFromRequestShortUpdate = R.pipe(
  applyAll([
    R.pipe(getRequest, R.prop('peer'), inputPeerToPeer, wrapAsObjWithKey('to_id')),
    R.pipe(getRequest, R.prop('message'), wrapAsObjWithKey('message')),
    R.pipe(getResponse, R.pick(['id', 'media', 'out'])),
    R.pipe(getAuthorizedUser, R.prop('id'), wrapAsObjWithKey('from_id'))
  ]),
  R.mergeAll,
  R.partial(construct, ['message'])
);

const getMessageFromUpdateResponse = R.pipe(
  getResponse,
  R.prop('updates'),
  x => {
    console.log(x);
    return x;
  },
  R.filter(R.anyPass([isObjectOf('updateNewChannelMessage'), isObjectOf('updateNewMessage')])),
  R.last,
  R.prop('message')
);

const buildMessage = R.cond([
  [isResponseHasShortUpdate, buildMessageFromRequestShortUpdate],
  [R.T, getMessageFromUpdateResponse]
]);

const handleMessageResponse = R.pipe(
  buildMessage,
  prependMessage
);

export default function sendMessageMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const sendMessage$ = R.partial(requestToTelegram$, [connection]);

  const sentMessage$ = authKeyCreated$.pipe(
    switchMapTo(action$),
    filter(isActionOf(SEND_MESSAGE)),
    map(R.prop('payload')),
    map(buildRequest),
    switchMap(x => combineLatest(
      of(x),
      sendMessage$(x),
      authorizedUser$(state$)
    ))
  );

  sentMessage$.subscribe(handleMessageResponse);
}
