import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED,
  ADD_MESSAGE,
  ADD_MESSAGES_BATCH
} from './constants.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {peerToPeerId} from '../utils.js';

const {isActionOf, buildReducer} = store;


const getState = R.nth(0);


const getAction = R.nth(1);


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
  R.map(getPeerIdFromDialog),
);

const buildDialogsOrder = R.pipe(
  R.of,
  R.ap([
    R.pipe(getState, R.propOr([], 'dialogsOrder')),
    buildNewDialogsOrder,
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
  R.fromPairs,
);

const buildDialogsMap = R.pipe(
  R.of,
  R.ap([
    buildNewDialogsMap,
    R.pipe(getState, R.prop('dialogs'))
  ]),
  R.mergeAll,
  wrapAsObjWithKey('dialogs'),
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

/**
 * Takes tuple with state and peer and returns state of dialog
 * @param {[*, *]}
 * @return {*}
 */
const getDialog = R.pipe(
  R.of,
  R.ap([
    R.always({}),
    R.pipe(R.nth(1), peerToPeerId),
    R.pipe(R.nth(0), R.prop('dialogs'))
  ]),
  R.apply(R.propOr)
);


const getDialogByMessage = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('to_id'))
  ]),
  getDialog
);

const getPeerIdFromMessage = R.pipe(
  R.prop('to_id'),
  peerToPeerId
);

/**
 * Takes message and returns lens for message_order of dialog
 */
const buildMessageOrderLens = R.pipe(
  getPeerIdFromMessage,
  R.partialRight(R.append, [['dialogs']]),
  R.append('messages_order'),
  R.lensPath
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
    R.pipe(R.path([1, 'id']), R.append),
    R.nth(0)
  ]),
  R.apply(R.over)
);

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
  R.of,
  R.ap([
    setNewMessageOrder,
    R.nth(1)
  ]),
  R.of,
  R.ap([
    setNewMessage,
    R.nth(1)
  ]),
  R.nth(0)
);

const handleAddMessage = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.path([1, 'payload'])
  ]),
  addMessage
);

const handleAddMessagesBatch = R.pipe(
  R.of,
  R.ap([
    R.always(R.unapply(addMessage)),
    R.nth(0),
    R.path([1, 'payload'])
  ]),
  R.apply(R.reduce)
);

export default buildReducer({}, [
  [isActionOf(LOAD_DIALOGS), handleLoadingTrue],
  [isActionOf(DIALOGS_LOAD_FAILED), handleDialogsLoadFailed],
  [isActionOf(DIALOGS_LOADED), handleDialogsLoaded],
  [isActionOf(ADD_MESSAGE), handleAddMessage],
  [isActionOf(ADD_MESSAGES_BATCH), handleAddMessagesBatch]
]);
