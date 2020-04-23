import loadDialogsMiddleware from './loadDialogsMiddleware.js';
import setActiveDialogMiddleware from './setActiveDialogMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  loadDialogsMiddleware(action$, state$, connection);
  setActiveDialogMiddleware(action$, state$, connection);
}
