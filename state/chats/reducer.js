import {SET_CHAT, SET_CHAT_LIST, SET_FULL_CHAT} from './constants.js';
const {buildReducer, isActionOf} = store;

const setBaseChatObject = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.prop('id'),
      R.of,
      R.append(['base']),
      R.lensPath
    ),
    R.identity,
    R.always({})
  ]),
  R.apply(R.set)
);

const setFullChatObject = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.prop('id'),
      R.of,
      R.append(['full']),
      R.lensPath
    ),
    R.identity,
    R.always({})
  ]),
  R.apply(R.set)
);

/**
 * Takes tuple of reducer and SET_CHAT action insert chat to reducer
 */
const setChat = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), setBaseChatObject)
  ]),
  R.apply(R.mergeDeepRight)
);


const setChatList = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), R.map(setBaseChatObject), R.mergeAll)
  ]),
  R.apply(R.mergeDeepRight)
);


const setFullChat = R.pipe(
  R.of,
  R.ap([
    R.nth(0),
    R.pipe(R.nth(1), R.prop('payload'), setFullChatObject)
  ]),
  R.apply(R.mergeDeepRight)
);

/**
 * Reducer to handle chats.
 * state is a js object where key is id of chat and value is telegrams chat object
 */
export default buildReducer({}, [
  [isActionOf(SET_CHAT), setChat],
  [isActionOf(SET_CHAT_LIST), setChatList],
  [isActionOf(SET_FULL_CHAT), setFullChat]
]);
