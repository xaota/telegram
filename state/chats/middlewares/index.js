import getFullChatMiddleware from './getFullChatMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  getFullChatMiddleware(action$, state$, connection);
}
