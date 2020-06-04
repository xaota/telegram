import {setChatList} from './chats/index.js';
import {setUserList} from './users/index.js';
import {prependMessage} from './dialogs/index.js';
import {applyAll, isAuthKeyCreated} from './utils.js';
import {wrapAsObjWithKey} from '../script/helpers.js';

const {of, fromEvent, merge} = rxjs;
const {map, filter, tap, switchMap, switchMapTo, withLatestFrom} = rxjs.operators;

const {isObjectOf, construct} = zagram;

const updateStateWithChats = R.pipe(R.prop('chats'), setChatList);
const updateStateWithUsers = R.pipe(R.prop('users'), setUserList);

const updateChatsUsersInfo = R.pipe(applyAll([
    updateStateWithChats,
    updateStateWithUsers
  ]));


/**
 * @param {[Object, Number]} param - tuple where first value is object of telegrams `updateShortMessage`
 *                                   and second value is id of authorized user
 * @returns {boolean} is out message or not
 */
const isOut = R.pathOr(false, [0, 'out']);

/**
 * @param {[Object, Number]} param - tuple where first value is object of telegrams `updateShortMessage`
 *                                   and second value is id of authorized user
 * @returns {Object} telegrams `peerUser` object
 */
const shortMessageToPeerUser = R.pipe(
  R.nth(0),
  R.pick(['user_id']),
  R.partial(construct, ['peerUser'])
);

/**
 * @param {[Object, Number]} param - tuple where first value is object of telegrams `updateShortMessage`
 *                                   and second value is id of authorized user
 * @returns {Object} telegrams `peerUser` object
 */
const userIdToPeerUser = R.pipe(
  R.nth(1),
  wrapAsObjWithKey('user_id'),
  R.partial(construct, ['peerUser'])
);

/**
 * @param {[Object, Number]} param - tuple where first value is object of telegrams `updateShortMessage`
 *                                   and second value is id of authorized user
 * @returns {Object} telegrams `peerUser` object
 */
const buildPeerUser = R.cond([
  [isOut, shortMessageToPeerUser],
  [R.T, userIdToPeerUser]
]);

/**
 * @param {[Object, Number]} param - tuple where first value is object of telegrams `updateShortMessage`
 *                                   and second value is id of authorized user
 * @returns {Object} telegrams `peerUser` object
 */
const buildFromId = R.cond([
  [isOut, R.nth(1)],
  [R.T, R.path([0, 'user_id'])]
]);

/**
 * @param {[Object, Number]} param - tuple where first value is object of telegrams `updateShortMessage`
 *                                   and second value is id of authorized user
 * @returns {Object} elegrams message object
 */
export const buildMessageFromUpdateShortMessage = R.pipe(
  applyAll([
    R.nth(0),
    R.pipe(buildPeerUser, wrapAsObjWithKey('to_id')),
    R.pipe(buildFromId, wrapAsObjWithKey('from_id'))
  ]),
  R.mergeAll,
  R.partial(construct, ['message'])
);


export const buildMessageFromUpdateShortChatMessage = R.pipe(
  applyAll([
    R.identity,
    R.pipe(R.partial(construct, ['peerChat']), wrapAsObjWithKey('to_id'))
  ]),
  R.mergeAll,
  R.partial(construct, ['message'])
);

export default function telegramUpdateMiddleware(action$, state$, connection) {
  const authUser$ = state$.pipe(map(R.path(['auth', 'user'])));
  const authUserId$ = authUser$.pipe(map(R.prop('id')));

  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const telegramUpdate$ = authKeyCreated$.pipe(switchMapTo(fromEvent(
    connection,
    'telegramUpdate'
  )))
    .pipe(map(R.prop('detail')));

  const updateShort$ = telegramUpdate$
    .pipe(
      filter(isObjectOf('updateShort')),
      map(R.prop('update'))
    );

  const updateShortMessage$ = telegramUpdate$.pipe(
    filter(isObjectOf('updateShortMessage')),
    withLatestFrom(authUserId$),
    map(buildMessageFromUpdateShortMessage)
  );

  const updateShortChatMessage$ = telegramUpdate$.pipe(
    filter(isObjectOf('updateShortChatMessage')),
    map(buildMessageFromUpdateShortChatMessage)
  );

  const updates$ = telegramUpdate$.pipe(
    filter(isObjectOf('updates')),
    tap(updateChatsUsersInfo),
    switchMap(R.pipe(
      R.prop('updates'),
      R.apply(of)
    ))
  );

  const update$ = merge(updates$, updateShort$);
  const updateMessage$ = update$.pipe(
    filter(R.anyPass([
      isObjectOf('updateNewChannelMessage'),
      isObjectOf('updateNewMessage')
    ])),
    map(R.prop('message'))
  );

  const newMessage$ = merge(updateMessage$, updateShortMessage$, updateShortChatMessage$);
  newMessage$.subscribe(prependMessage);
}
