import sendAuthMiddleware from './sendAuthMiddleware.js';
import sendVerifyCodeMiddleware from './sendVerifyCodeMiddleware.js';
import signUpMiddleware from './signUpMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  sendAuthMiddleware(action$, state$, connection);
  sendVerifyCodeMiddleware(action$, state$, connection);
  signUpMiddleware(action$, state$, connection);
}
