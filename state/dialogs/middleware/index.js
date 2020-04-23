import loadDialogsMiddleware from './loadDialogsMiddleware.js';
import setActiveDialogMiddleware from './setActiveDialogMiddleware.js';
import loadDialogHistoryMiddleware from './loadDialogHistoryMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  loadDialogsMiddleware(action$, state$, connection);
  setActiveDialogMiddleware(action$, state$, connection);
  loadDialogHistoryMiddleware(action$, state$, connection);
}
