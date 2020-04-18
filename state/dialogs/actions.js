const {dispatch} = store;

import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED,
  ADD_MESSAGE
} from './constants.js';

export const loadDialogs = R.partial(dispatch, [LOAD_DIALOGS]);
export const setLoadDialogsFailed = R.partial(dispatch, [DIALOGS_LOAD_FAILED]);
export const setDialogsLoaded = R.partial(dispatch, [DIALOGS_LOADED]);
export const addMessage = R.partial(dispatch, [ADD_MESSAGE]);
