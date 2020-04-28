import {SET_SIDE_BAR} from './constants.js';

const {dispatch}  = store;

export const openSideBar = R.partial(dispatch, [SET_SIDE_BAR, true]);
export const closeSideBar = R.partial(dispatch, [SET_SIDE_BAR, false]);
