import {
  SET_CHAT,
  SET_CHAT_LIST,
  GET_FULL_CHAT,
  SET_FULL_CHAT
} from './constants.js';
const {dispatch} = store;

export const setChatList = R.partial(dispatch, [SET_CHAT_LIST]);
export const setChat = R.partial(dispatch, [SET_CHAT]);
export const setFullChat = R.partial(dispatch, [SET_FULL_CHAT]);

export const getFullChat = R.partial(dispatch, [GET_FULL_CHAT]);
