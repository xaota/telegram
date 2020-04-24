import getFullUserMiddleware from './getFullUserMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  getFullUserMiddleware(action$, state$, connection);
}
