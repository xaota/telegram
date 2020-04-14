import loadDialogsMiddleware from './loadDialogsMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  loadDialogsMiddleware(action$, state$, connection);
}
