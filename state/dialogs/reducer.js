import {
  ADD_MESSAGE,
  ADD_MESSAGES_BATCH,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED,
  LOAD_DIALOGS,
  SET_ACTIVE_DIALOG,
  SET_SEARCHED_DIALOG_MESSAGES,
  CLEAR_SEARCHED_DIALOG_MESSAGES
} from './constants.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {peerToPeerId, getAction, getState, getActionPayload} from '../utils.js';

const {construct, isObjectOf} = zagram;
const {isActionOf, buildReducer} = store;


const handleLoadingTrue = R.pipe(
  R.nth(0),
  R.of,
  R.ap([
    R.identity,
    R.always({dialogsLoading: true})
  ]),
  R.mergeAll
);


const unsetLoading = R.omit(['dialogsLoading']);

const removeLoadingFromState = R.pipe(
  getState,
  unsetLoading
);


const getPeerFormDialog = R.prop('peer');

const getPeerIdFromDialog = R.pipe(getPeerFormDialog, peerToPeerId);

const buildNewDialogsOrder = R.pipe(
  getAction,
  R.prop('payload'),
  R.map(getPeerIdFromDialog)
);

const buildDialogsOrder = R.pipe(
  R.of,
  R.ap([
    R.pipe(getState, R.propOr([], 'dialogsOrder')),
    buildNewDialogsOrder
  ]),
  R.flatten,
  R.uniq,
  wrapAsObjWithKey('dialogsOrder')
);

const buildDialogsPair = R.pipe(
  R.of,
  R.ap([getPeerIdFromDialog, R.set(R.lensProp('info'), R.__, {messages: {}, messages_order: []})])
);

const buildNewDialogsMap = R.pipe(
  getAction,
  R.prop('payload'),
  R.map(buildDialogsPair),
  R.fromPairs
);

const buildDialogsMap = R.pipe(
  R.of,
  R.ap([
    buildNewDialogsMap,
    R.pipe(getState, R.prop('dialogs'))
  ]),
  R.mergeAll,
  wrapAsObjWithKey('dialogs')
);

const handleDialogsLoadFailed = removeLoadingFromState;


const handleDialogsLoaded = R.pipe(
  R.of,
  R.ap([
    removeLoadingFromState,
    buildDialogsOrder,
    buildDialogsMap
  ]),
  R.mergeAll
);

const getPeerIdFromMessage = R.pipe(
  R.prop('to_id'),
  peerToPeerId
);


/**
 * Takes peerId returns lens for dialogs messages order
 */
const buildOrderLens = R.pipe(
  R.partialRight(R.append, [['dialogs']]),
  R.append('messages_order'),
  R.lensPath
);

/**
 * Takes message and returns lens for message_order of dialog
 */
const buildMessageOrderLens = R.pipe(
  getPeerIdFromMessage,
  buildOrderLens
);


/**
 * Takes peerId returns lens for dialog search order
 */
const buildSearchOrderLens = R.pipe(
  R.partialRight(R.append, [['dialogs']]),
  R.append('search_order'),
  R.lensPath
);

/**
 * Takes message and returns lens for search_order of dialog
 */
const buildSearchMessageOrderLens = R.pipe(
  getPeerIdFromMessage,
  buildSearchOrderLens
);

const buildMessageLens = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      getPeerIdFromMessage,
      R.partialRight(R.append, [['dialogs']]),
      R.append('messages')
    ),
    R.pipe(R.prop('id'), x => x.toString())
  ]),
  R.flatten,
  R.lensPath
);


/**
 * Takes tuple with state and action data. Returns state with order of new message
 * @param {[*, *]} tuple - action
 * @return {*}
 */
const setNewMessageOrder = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.nth(1), buildMessageOrderLens),
    R.pipe(R.path([1, 'id']), R.append, R.curry(R.binary(R.compose))(R.uniq)),
    R.nth(0)
  ]),
  R.apply(R.over)
);

const setSearchMessageOrder = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.nth(1), buildSearchMessageOrderLens),
    R.pipe(R.path([1, 'id']), R.append, R.curry(R.binary(R.compose))(R.uniq)),
    R.nth(0)
  ]),
  R.apply(R.over)
);

/**
 * Takes tuple with state and message. Returns has state dialog for message or not
 */
const isOutgoingMessage = R.pipe(
  R.propOr(false, 'out'),
  R.equals(true)
);

const isNotPeerUserMessage = R.pipe(
  R.prop('to_id'),
  isObjectOf('peerUser'),
  R.not
);

/**
 * Takes message and build peerUser with id from `from_id`
 */
const changeMessageToId = R.pipe(
  R.of,
  R.ap([
    R.identity,
    R.pipe(
      R.prop('from_id'),
      wrapAsObjWithKey('user_id'),
      R.partial(construct, ['peerUser']),
      wrapAsObjWithKey('to_id')
    )
  ]),
  R.mergeAll
);

const setToPeerForMessage = R.cond([
  [
    R.anyPass([
      R.pipe(R.nth(1), isNotPeerUserMessage),
      R.pipe(R.nth(1), isOutgoingMessage)
    ]),
    R.identity
  ],
  [
    R.T,
    R.pipe(
      R.of,
      R.ap([
        R.nth(0),
        R.pipe(R.nth(1), changeMessageToId)
      ])
    )
  ]
]);

/**
 * Takes tuple with state and action data. Returns state with dialog
 */
const setNewMessage = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.nth(1), buildMessageLens),
    R.nth(1),
    R.nth(0)
  ]),
  R.apply(R.set)
);

/**
 * Takes tuple with current state and message. Returns state with updated dialog
 */
const addMessage = R.pipe(
  setToPeerForMessage,
  R.of,
  R.ap([
    setNewMessage,
    R.nth(1)
  ]),
  R.of,
  R.ap([
    setNewMessageOrder,
    R.nth(1)
  ]),
  R.nth(0)
);

const addSearchMessage = R.pipe(
  setToPeerForMessage,
  R.of,
  R.ap([
    setNewMessage,
    R.nth(1)
  ]),
  R.of,
  R.ap([
    setSearchMessageOrder,
    R.nth(1)
  ]),
  R.nth(0)
);

const handleAddMessage = R.pipe(
  R.of,
  R.ap([
    getState,
    R.path([1, 'payload'])
  ]),
  addMessage
);

const handleAddMessagesBatch = R.pipe(
  R.of,
  R.ap([
    R.always(R.unapply(addMessage)),
    getState,
    R.path([1, 'payload'])
  ]),
  R.apply(R.reduce)
);

const handleSetActiveDialog = R.pipe(
  R.of,
  R.ap([
    getState,
    R.pipe(getAction, R.prop('payload'), wrapAsObjWithKey('activeDialog'))
  ]),
  R.mergeAll
);

const handleSetSearchedDialogMessages = R.pipe(
  R.of,
  R.ap([
    R.always(R.unapply(addSearchMessage)),
    getState,
    R.path([1, 'payload'])
  ]),
  R.apply(R.reduce)
);

const handleClearSearchedDialogMessages = R.pipe(
  R.of,
  R.ap([
    R.pipe(getActionPayload, peerToPeerId, buildSearchOrderLens),
    R.always([]),
    getState
  ]),
  R.apply(R.set)
);

export default buildReducer({}, [
  [isActionOf(LOAD_DIALOGS), handleLoadingTrue],
  [isActionOf(DIALOGS_LOAD_FAILED), handleDialogsLoadFailed],
  [isActionOf(DIALOGS_LOADED), handleDialogsLoaded],
  [isActionOf(ADD_MESSAGE), handleAddMessage],
  [isActionOf(ADD_MESSAGES_BATCH), handleAddMessagesBatch],
  [isActionOf(SET_ACTIVE_DIALOG), handleSetActiveDialog],
  [isActionOf(SET_SEARCHED_DIALOG_MESSAGES), handleSetSearchedDialogMessages],
  [isActionOf(CLEAR_SEARCHED_DIALOG_MESSAGES), handleClearSearchedDialogMessages]
]);
