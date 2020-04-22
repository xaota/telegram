import {getPeerInfoSelectorByPeerId} from './helpers.js';
import {getUser$} from '../users/stream-builders.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';

const {combineLatest, of} = rxjs;
const {map, switchMap} = rxjs.operators;


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
 * Get's info about peer by it's id
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} peerId - id of peer(same as dialogId)
 * @returns {Observable<*>} - observable of info about peer
 */
export function getPeerInfo$(state$, peerId) {
  return state$.pipe(map(getPeerInfoSelectorByPeerId(peerId)));
}


/**
 * @param {Observable<*>} state$ - stream of current state
 * @param {string} dialogId- id of peer(same as dialogId)
 * @returns {Observable<*>} - observable of dialog with peer info
 */
export function getDialogWithPeerInfo$(state$, dialogId) {
  const addPeerInfoToDialog = R.set(R.lensProp('peer_info'));
  return combineLatest(
    getPeerInfo$(state$, dialogId),
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
 * @param {Observable<*>} state$ - stream of current state$
 * @return {Observable<string>} - id of active(selected dialog)
 */
export function getActiveDialogId$(state$) {
  const getActiveDialogId = R.path(['dialogs', 'activeDialog'])
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
  return getActiveDialogId$(state$).pipe(
    switchMap(getActiveDialog$)
  );
}

