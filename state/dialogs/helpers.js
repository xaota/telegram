/**
 * Takes dialog structure and returns last message
 */
import { peerIdToPeer } from '../utils.js'

const {isObjectOf} = zagram;

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
  R.partialRight(R.append, [['users']]),
  R.path
);

const buildChatByIdSelector = R.pipe(
  R.prop('chat_id'),
  R.partialRight(R.append, [['chats']]),
  R.path
);

const buildChannelByIdSelector = R.pipe(
  R.prop('channel_id'),
  R.partialRight(R.append, [['chats']]),
  R.path
);

export const getPeerInfoSelectorByPeerId = R.pipe(
  peerIdToPeer,
  R.cond([
    [isObjectOf('peerUser'), buildUserByIdSelector],
    [isObjectOf('peerChat'), buildChatByIdSelector],
    [R.T, buildChannelByIdSelector]
  ])
);

export const getDialogTitle = R.pipe(
  R.prop('peer_info'),
  R.cond([
    [R.equals(undefined), R.always('dialog')],
    [isObjectOf('user'), R.prop('first_name')],
    [isObjectOf('chat'), R.prop('title')],
    [isObjectOf('channel'), R.prop('title')],
    [R.T, R.always('dialog')]
  ])
);