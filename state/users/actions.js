import {SET_USER, SET_USER_LIST, GET_FULL_USER, SET_USER_FULL} from './constants.js';
const {dispatch} = store;

export const setUser = R.partial(dispatch, [SET_USER]);
export const setUserList = R.partial(dispatch, [SET_USER_LIST]);
export const setFullUser = R.partial(dispatch, [SET_USER_FULL]);

export const getFullUser = R.partial(dispatch, [GET_FULL_USER]);
