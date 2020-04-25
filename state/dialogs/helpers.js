/**
 * Takes dialog structure and returns last message
 */
import {peerIdToPeer} from '../utils.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';

const {isObjectOf, construct} = zagram;

export const getLastMessage = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.pathOr(-1, ['info', 'top_message']),
      x => x.toString(),
      R.partialRight(R.append, [['messages']])
    ),
    R.identity
  ]),
  R.apply(R.path)
);

export const getDialogWithLastMessage = R.pipe(
  R.of,
  R.ap([
    getLastMessage,
    R.prop('info')
  ]),
  R.apply(R.set(R.lensProp('last_message')))
);

const buildUserByIdSelector = R.pipe(
  R.prop('user_id'),
  R.toString,
  x => ['users', x],
  R.path
);

const buildChatByIdSelector = R.pipe(
  R.prop('chat_id'),
  R.toString,
  x => ['chats', x],
  R.path
);

const buildChannelByIdSelector = R.pipe(
  R.prop('channel_id'),
  R.toString,
  x => ['chats', x],
  R.path
);

export const getPeerBaseInfoSelectorByPeerId = R.pipe(
  peerIdToPeer,
  R.cond([
    [isObjectOf('peerUser'), buildUserByIdSelector],
    [isObjectOf('peerChat'), buildChatByIdSelector],
    [R.T, buildChannelByIdSelector]
  ]),
  R.curry(R.binary(R.compose))(R.prop('base'))
);

export const getPeerCommonInfoSelectorByPeerId = R.pipe(
  peerIdToPeer,
  R.cond([
    [isObjectOf('peerUser'), buildUserByIdSelector],
    [isObjectOf('peerChat'), buildChatByIdSelector],
    [R.T, buildChannelByIdSelector]
  ])
);

/**
 * @param {*} user - user object
 * @returns {*} - telegram's input peer user
 */
const userToInputPeerUser = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('id'), wrapAsObjWithKey('user_id')),
    R.pipe(R.prop('access_hash'), wrapAsObjWithKey('access_hash'))
  ]),
  R.mergeAll,
  R.partial(construct, ['inputPeerUser'])
);

/**
 * @param {*} userPeer - peer of user
 * @returns {Function} - returns function that takes state, and returns inputPeerUser
 */
const buildInputPeerUserSelector = R.pipe(
  buildUserByIdSelector,
  R.curry(R.binary(R.compose))(R.prop('base')),
  R.curry(R.binary(R.compose))(userToInputPeerUser)
);


const chatToInputPeerChat = R.pipe(
  R.prop('id'),
  wrapAsObjWithKey('chat_id'),
  R.partial(construct, ['inputPeerChat'])
);

/**
 * @param {*} chatPeer - peer of chat
 * @returns {Function} - returns function that takes state, and returns inputPeerChat
 */
const buildInputPeerChatSelector = R.pipe(
  buildChatByIdSelector,
  R.curry(R.binary(R.compose))(chatToInputPeerChat)
);

/**
 * @param {*} channel -
 */
const peerChannelToInputPeerChannel = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('id'), wrapAsObjWithKey('channel_id')),
    R.pipe(R.prop('access_hash'), wrapAsObjWithKey('access_hash'))
  ]),
  R.mergeAll,
  R.partial(construct, ['inputPeerChannel'])
);

/**
 * @param {*} channelPeer - peer of channel
 * @returns {Function} - returns function that takes state, and returns inputPeerChannel
 */
const buildInputPeerChannelSelector = R.pipe(
  buildChannelByIdSelector,
  R.curry(R.binary(R.compose))(R.prop('base')),
  R.curry(R.binary(R.compose))(peerChannelToInputPeerChannel)
);

/**
 * @param {string} dialogId
 * @return {Function} - returns function that takes state and returns InputPeer object
 */
export const getInputPeerSelectorByPeerId = R.cond([
  [R.isNil, R.always(() => null)],
  [
    R.T,
    R.pipe(
      peerIdToPeer,
      R.cond([
        [isObjectOf('peerUser'), buildInputPeerUserSelector],
        [isObjectOf('peerChat'), buildInputPeerChatSelector],
        [R.T, buildInputPeerChannelSelector]
      ])
    )
  ]
]);

const getFullName = R.pipe(
  R.of,
  R.ap([
    R.propOr('', 'first_name'),
    R.propOr('', 'last_name')
  ]),
  R.join(' ')
);


export const getTitle = R.cond([
  [R.equals(undefined), R.always('dialog')],
  [isObjectOf('user'), getFullName],
  [isObjectOf('chat'), R.prop('title')],
  [isObjectOf('channel'), R.prop('title')],
  [R.T, R.always('dialog')]
]);

export const getDialogTitle = R.pipe(
  R.prop('peer_info'),
  getTitle
);
