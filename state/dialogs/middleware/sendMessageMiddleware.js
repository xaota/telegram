import {SEND_MESSAGE} from '../constants.js';
import {prependMessage} from '../actions.js';
import {isAuthKeyCreated, requestToTelegram$, applyAll, inputPeerToPeer} from '../../utils.js';
import {getRandomBigInt} from '../../../script/crypto.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';
import {authorizedUser$} from '../../auth/stream-builders.js';

const fromPromise = rxjs.from;
const {of, fromEvent, combineLatest, iif} = rxjs;
const {map, filter, switchMap, switchMapTo} = rxjs.operators;
const {isActionOf} = store;
const {method, isObjectOf, construct} = zagram;


function attachRandomId(x) {
  return {random_id: getRandomBigInt(8), ...x};
}

const buildTextRequest = R.pipe(
  attachRandomId,
  R.partial(method, ['messages.sendMessage'])
);

const buildMediaRequest = R.pipe(
  attachRandomId,
  R.partial(method, ['messages.sendMedia'])
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

function sendTextMessage$(connection, data) {
  const sendMessage$ = R.partial(requestToTelegram$, [connection]);
  return of(data).pipe(
    map(buildTextRequest),
    switchMap(sendMessage$)
  );
}

/**
 * Uploads file returns input media
 * @param connection
 * @param file
 */
function uploadFile$(connection, file) {
  const {promise} = connection.upload(file, R.identity);
  return fromPromise(promise).pipe(
    map(wrapAsObjWithKey('file')),
    map(R.partial(construct, ['inputMediaUploadedPhoto']))
  );
}

function sendMediaMessage$(connection, data) {
  const sendMedia$ = R.partial(requestToTelegram$, [connection]);
  return combineLatest(
    of(data).pipe(map(R.omit(['media']))),
    uploadFile$(connection, data.media).pipe(map(wrapAsObjWithKey('media')))
  ).pipe(
    map(R.mergeAll),
    map(buildMediaRequest),
    switchMap(sendMedia$)
  );
}

export default function sendMessageMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const sentMessage$ = authKeyCreated$.pipe(
    switchMapTo(action$),
    filter(isActionOf(SEND_MESSAGE)),
    map(R.prop('payload')),
    switchMap(x => combineLatest(
      of(x),
      iif(
        () => R.has('media', x),
        sendMediaMessage$(connection, x),
        sendTextMessage$(connection, x)
      ),
      authorizedUser$(state$)
    ))
  );

  sentMessage$.subscribe(handleMessageResponse);
}
