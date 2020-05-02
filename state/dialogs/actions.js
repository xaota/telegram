const {dispatch} = store;

import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED,
  ADD_MESSAGE,
  PREPEND_MESSAGE,
  ADD_MESSAGES_BATCH,
  SET_ACTIVE_DIALOG,
  SET_SEARCHED_DIALOG_MESSAGES,
  LOAD_DIALOG_HISTORY,
  SEARCH_DIALOG_MESSAGES,
  CLEAR_SEARCHED_DIALOG_MESSAGES
} from './constants.js';

export const loadDialogs = R.partial(dispatch, [LOAD_DIALOGS]);
export const setLoadDialogsFailed = R.partial(dispatch, [DIALOGS_LOAD_FAILED]);
export const setDialogsLoaded = R.partial(dispatch, [DIALOGS_LOADED]);
export const addMessage = R.partial(dispatch, [ADD_MESSAGE]);
export const prependMessage = R.partial(dispatch, [PREPEND_MESSAGE]);
export const addMessagesBatch = R.partial(dispatch, [ADD_MESSAGES_BATCH]);
export const setActiveDialog = R.partial(dispatch, [SET_ACTIVE_DIALOG]);
export const setSearchedDialogMessages= R.partial(dispatch, [SET_SEARCHED_DIALOG_MESSAGES]);
export const clearSearchedDialogs = R.partial(dispatch, [CLEAR_SEARCHED_DIALOG_MESSAGES]);

export const loadDialogHistory = R.partial(dispatch, [LOAD_DIALOG_HISTORY]);
export const searchDialogMessages = R.partial(dispatch, [SEARCH_DIALOG_MESSAGES]);
