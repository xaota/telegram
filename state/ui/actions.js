import {SET_SIDE_BAR, SET_SEARCH_BAR, SET_MESSAGE_SPLASH_SCREEN} from './constants.js';

const {dispatch}  = store;

export const openSideBar = R.partial(dispatch, [SET_SIDE_BAR, true]);
export const closeSideBar = R.partial(dispatch, [SET_SIDE_BAR, false]);

export const openSearchBar = R.partial(dispatch, [SET_SEARCH_BAR, true]);
export const closeSearchBar = R.partial(dispatch, [SET_SEARCH_BAR, false]);

export const setMessageSplashScreen = R.partial(dispatch, [SET_MESSAGE_SPLASH_SCREEN]);
export const clearMessageSplashScreen = R.partial(setMessageSplashScreen, [null]);
