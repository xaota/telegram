import {SET_SIDE_BAR, SET_MESSAGE_SPLASH_SCREEN} from './constants.js';

const {dispatch}  = store;

export const openSideBar = R.partial(dispatch, [SET_SIDE_BAR, true]);
export const closeSideBar = R.partial(dispatch, [SET_SIDE_BAR, false]);

export function setMessageSplashScreen(dialogId, messageId) {
  dispatch(SET_MESSAGE_SPLASH_SCREEN, {dialogId, messageId});
}
export const clearMessageSplashScreen = R.partial(dispatch [SET_MESSAGE_SPLASH_SCREEN, null]);
