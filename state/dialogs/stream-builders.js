import {
  getPeerBaseInfoSelectorByPeerId,
  getInputPeerSelectorByPeerId,
  getPeerCommonInfoSelectorByPeerId
} from './helpers.js';
import {getUser$} from '../users/stream-builders.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';

const {combineLatest, of} = rxjs;
const {map, switchMap, withLatestFrom} = rxjs.operators;


/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - dialog id to get
 * @returns {Observable<{ info: *, messages_order: Array<Number>, messages: *}>}
 */
export function getDialogStructure$(state$, dialogId) {
  return state$.pipe(map(R.path(['dialogs', 'dialogs', dialogId])));
}


/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - dialog id to get
 * @returns {Observable<*>} - observable of dialogs info
 */
export function getDialogInfo$(state$, dialogId) {
  return getDialogStructure$(state$, dialogId).pipe(map(R.cond([
    [R.isNil, R.always(null)],
    [R.T, R.prop('info')]
  ])));
}


/**
 * Get's base info about peer by it's id
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} peerId - id of peer(same as dialogId)
 * @returns {Observable<*>} - observable of info about peer
 */
export function getBasePeerInfo$(state$, peerId) {
  return state$.pipe(map(getPeerBaseInfoSelectorByPeerId(peerId)));
}

/**
 * Get's common info about peer by it's id
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} peerId - id of peer(same as dialogId)
 * @returns {Observable<*>} - observable of info about peer
 */
export function getPeerCommonInfo$(state$, peerId) {
  return state$.pipe(map(getPeerCommonInfoSelectorByPeerId(peerId)));
}


/**
 * Get's common info about peer by it's id
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} peerId - id of peer(same as dialogId)
 * @returns {Observable<*>} - observable of input peer
 */
export function getInputPeer$(state$, peerId) {
  return state$.pipe(map(getInputPeerSelectorByPeerId(peerId)));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId- id of peer(same as dialogId)
 * @returns {Observable<*>} - observable of dialog with peer info
 */
export function getDialogWithPeerInfo$(state$, dialogId) {
  const addPeerInfoToDialog = R.set(R.lensProp('peer_info'));
  return combineLatest(
    getBasePeerInfo$(state$, dialogId),
    getDialogInfo$(state$, dialogId)
  ).pipe(map(R.apply(addPeerInfoToDialog)));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - id of curr
 * @param {number} messageId
 * @returns {Observable<*>} - stream of current message
 */
export function getMessage$(state$, dialogId, messageId) {
  const messageSelector = R.path([
    'dialogs',
    'dialogs',
    dialogId,
    'messages',
    R.toString(messageId)
  ]);
  return state$.pipe(map(messageSelector));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - id of curr
 * @param {number} messageId
 * @returns {Observable<*>} - stream of authors message
 */
export function getMessageAuthor$(state$, dialogId, messageId) {
  const getAuthorId = R.path(['dialogs', 'dialogs', dialogId, 'messages', messageId, 'from_id']);
  return state$.pipe(
    map(getAuthorId),
    switchMap(R.partial(getUser$, [state$]))
  );
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - id of curr
 * @param {number} messageId
 * @returns {Observable<*>} - stream of current message with author
 */
export function getMessageWithAuthor$(state$, dialogId, messageId) {
  return combineLatest(
    getMessageAuthor$(state$, dialogId, messageId).pipe(map(wrapAsObjWithKey('author'))),
    getMessage$(state$, dialogId, messageId)
  ).pipe(map(R.mergeAll));
}


/**
 * @param {Observable<*>} state$ - stream of current stream
 * @param {string} dialogId  - id of dialog
 * @returns {Observable<*>} - stream of last message of dialog
 */
export function getLastDialogMessage$(state$, dialogId) {
  return getDialogInfo$(state$, dialogId).pipe(
    map(R.prop('top_message')),
    switchMap(messageId => getMessageWithAuthor$(state$, dialogId, messageId))
  );
}


/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - dialog id to get
 * @returns {Observable<*>} - observable of dialog and last message
 */
export function getDialogWithLastMessage$(state$, dialogId) {
  return combineLatest(
    getLastDialogMessage$(state$, dialogId).pipe(map(wrapAsObjWithKey('last_message'))),
    getDialogWithPeerInfo$(state$, dialogId)
  ).pipe(map(R.mergeAll));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - id of dialog to show messages
 * @returns {Observable<Array<*>>} - observable of messages list for dialog
 */
export function getDialogMessages$(state$, dialogId) {
  const dialogStructure$ = getDialogStructure$(state$, dialogId);
  return dialogStructure$.pipe(
    map(R.propOr([], 'messages_order')),
    map(R.map(R.prop)),
    withLatestFrom(dialogStructure$.pipe(map(R.pipe(R.prop('messages'), R.of)))),
    map(R.apply(R.ap))
  );
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId - id of dialog to show messages
 * @returns {Observable<Array<string>>} - observable of messages ids
 */
export function getDialogSearchMessagesId$(state$, dialogId) {
  const dialogStructure$ = getDialogStructure$(state$, dialogId);
  return dialogStructure$.pipe(
    map(R.propOr([], 'search_order')),
    map(R.map(R.prop)),
    withLatestFrom(dialogStructure$.pipe(map(R.pipe(R.prop('messages'), R.of)))),
    map(R.apply(R.ap))
  );
}

/**
 * @param {Observable<*>} state$ - stream of current state$
 * @return {Observable<string>} - id of active(selected dialog)
 */
export function getActiveDialogId$(state$) {
  const getActiveDialogId = R.path(['dialogs', 'activeDialog']);
  return state$.pipe(map(getActiveDialogId));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @return {Observable<string>} - info with peer info about active dialog
 */
export function getActiveDialogInfo$(state$) {
  const getActiveDialog$ = R.cond([
    [R.isNil, R.always(of(null))],
    [R.T, R.partial(getDialogWithPeerInfo$, [state$])]
  ]);
  return getActiveDialogId$(state$).pipe(switchMap(getActiveDialog$));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @returns {Observable<Array<*>>} - observable of messages list for dialog
 */
export function getActiveDialogMessages$(state$) {
  const getActiveDialog$ = R.cond([
    [R.isNil, R.always(of([]))],
    [R.T, R.partial(getDialogMessages$, [state$])]
  ]);

  return getActiveDialogId$(state$).pipe(switchMap(getActiveDialog$));
}

/**
 * @param {Observable<*>} state$ - stream of current state
 * @returns {Observable<*>} - observable of input peer of active dialog
 */
export function getActiveDialogInputPeer$(state$) {
  const getPeer$ = R.cond([
    [R.isNil, R.always(of([]))],
    [R.T, R.partial(getInputPeer$, [state$])]
  ]);

  return getActiveDialogId$(state$).pipe(switchMap(getPeer$));
}

/**
 * @param {Observable<*>} state$ - stream of application state
 * @returns {Observable<*>} - stream of objects to load next batch of history for active dialog
 */
export function getNextHistoryLoader$(state$) {
  const activeDialogId$ = getActiveDialogId$(state$);

  const lastMessageId$ = activeDialogId$.pipe(
    map(x => R.pathOr([], ['dialogs', 'dialogs', x, 'messages_order'])),
    withLatestFrom(state$),
    map(R.apply(R.call)),
    map(R.last)
  );

  const inputPeer$ = activeDialogId$.pipe(
    map(R.cond([
      [R.isNil, R.always(() => null)],
      [R.T, getInputPeerSelectorByPeerId]
    ])),
    withLatestFrom(state$),
    map(R.apply(R.call))
  );

  return inputPeer$.pipe(
    withLatestFrom(lastMessageId$),
    map(R.zip(['peer', 'offset_id'])),
    map(R.fromPairs)
  );
}

/**
 * @param {Observable<*>} state$ - stream of application state
 * @returns {Observable<*>} - stream of objects with common info about peer
 */
export function getPeerCommonInfoOfActiveDialog$(state$) {
  const getInfo$ = R.cond([
    [R.isNil, R.always(of([]))],
    [R.T, R.partial(getPeerCommonInfo$, [state$])]
  ]);
  return getActiveDialogId$(state$).pipe(switchMap(getInfo$));
}

export function getActiveDialogSearchedMessages$(state$) {
  const getSearchedResults$ = R.cond([
    [R.isNil, R.always(of([]))],
    [R.T, R.partial(getDialogSearchMessagesId$, [state$])]
  ]);

  return getActiveDialogId$(state$).pipe(switchMap(getSearchedResults$));
}

/**
 * @param {Observable<*>} state$ - stream of application state
 * @returns {Observable<*>} - stream of objects with latest search message id
 */
export function getLastSearchedMessageId$(state$) {
  return getActiveDialogId$(state$).pipe(
    switchMap(R.partial(getDialogStructure$, [state$])),
    map(R.pipe(R.propOr([], 'search_order'), R.last))
  );
}
