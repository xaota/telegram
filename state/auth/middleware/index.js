import sendAuthMiddleware from './sendAuthMiddleware.js';
import sendVerifyCodeMiddleware from './sendVerifyCodeMiddleware.js';
import signUpMiddleware from './signUpMiddleware.js';
import sendPasswordMiddleware from './sendPasswordMiddleware.js';
import initConnectionMiddleware from './initConnectionMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  initConnectionMiddleware(action$, state$, connection);
  sendAuthMiddleware(action$, state$, connection);
  sendVerifyCodeMiddleware(action$, state$, connection);
  signUpMiddleware(action$, state$, connection);
  sendPasswordMiddleware(action$, state$, connection);
}
