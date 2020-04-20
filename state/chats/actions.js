import {SET_CHAT, SET_CHAT_LIST} from './constants.js';
const {dispatch} = store;

export const setChatList = R.partial(dispatch, [SET_CHAT_LIST]);
export const setChat = R.partial(dispatch, [SET_CHAT]);
