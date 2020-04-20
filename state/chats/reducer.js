import {SET_CHAT, SET_CHAT_LIST} from './constants.js';
const {buildReducer, isActionOf} = store;

/**
 *  wraps chat object to object where key is id of chat and value is
 *  chat object
 */
const wrapChatObject = R.pipe(
  R.of,
  R.ap([
    R.prop('id'),
    R.identity
  ]),
  R.of,
  R.fromPairs
);

/**
 * Takes tuple of reducer and SET_CHAT action insert user to reducer
 */
const setChat = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), wrapChatObject)
  ]),
  R.mergeAll
);


const setChatList = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), R.map(wrapChatObject))
  ]),
  R.flatten,
  R.mergeAll
);

/**
 * Reducer to handle chats.
 * state is a js object where key is id of chat and value is telegrams chat object
 */
export default buildReducer({}, [
  [isActionOf(SET_CHAT), setChat],
  [isActionOf(SET_CHAT_LIST), setChatList]
]);
