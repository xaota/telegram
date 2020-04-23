import {wrapAsObjWithKey} from '../script/helpers.js';
const {construct, isObjectOf} = zagram;


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
