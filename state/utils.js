import {wrapAsObjWithKey} from '../script/helpers.js';

const {construct, isObjectOf} = zagram;

const fromPromise = rxjs.from;
const {catchError} = rxjs.operators;

export const isAuthKeyCreated = R.pipe(
  R.prop('status'),
  R.equals('AUTH_KEY_CREATED')
);


/**
 * Takes peer and returns string that could be used as id of dialog
 *
 * @param {*} peer - peer object
 * @returns string - dialog id
 */
export const peerToPeerId = R.cond([
  [isObjectOf('peerUser'), R.pipe(R.prop('user_id'), x => `peer_user_${x}`)],
  [isObjectOf('peerChat'), R.pipe(R.prop('chat_id'), x => `peer_chat_${x}`)],
  [isObjectOf('peerChannel'), R.pipe(R.prop('channel_id'), x => `peer_channel_${x}`)],
  [R.T, 'unknown_peer']
]);


/**
 * Takes input peer and returns string that could be used as id of dialog
 *
 * @param {*} peer - input peer object
 * @returns string - dialog id
 */
export const inputPeerToPeerId = R.cond([
  [isObjectOf('inputPeerUser'), R.pipe(R.prop('user_id'), x => `peer_user_${x}`)],
  [isObjectOf('inputPeerChat'), R.pipe(R.prop('chat_id'), x => `peer_chat_${x}`)],
  [isObjectOf('inputPeerChannel'), R.pipe(R.prop('channel_id'), x => `peer_channel_${x}`)],
  [R.T, 'unknown_peer']
]);


const toInt = R.pipe(
  R.match(/\d+/),
  R.partialRight(parseInt, [10])
);


/**
 * Takes string and returns peer object
 * @takes {string} - peer_id
 * @returns {*}
 */
export const peerIdToPeer = R.cond([
  [
    R.test(/^peer_user/),
    R.pipe(toInt, wrapAsObjWithKey('user_id'), R.partial(construct, ['peerUser']))
  ],
  [
    R.test(/^peer_chat/),
    R.pipe(toInt, wrapAsObjWithKey('chat_id'), R.partial(construct, ['peerChat']))
  ],
  [
    R.test(/^peer_channel/),
    R.pipe(toInt, wrapAsObjWithKey('channel_id'), R.partial(construct, ['peerChannel']))
  ]
]);


export const inputPeerToPeer = R.pipe(inputPeerToPeerId, peerIdToPeer);


/**
 * @param {MTProto} connection - telegram connection
 * @param {Object} methodObject - request that will be send
 * @returns {Observable} - stream with response
 */
export function requestToTelegram$(connection, methodObject) {
  return fromPromise(connection.request(methodObject)).pipe(catchError(R.of));
}

export const getState = R.nth(0);

export const getAction = R.nth(1);

export const getActionPayload = R.pipe(getAction, R.prop('payload'));

export const applyAll = R.pipe(
  R.ap,
  R.curry(R.binary(R.pipe))(R.of)
);
