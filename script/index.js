import Router   from './ui/Router.js';
import Telegram from './telegram/Telegram.js';

import config   from './app/config.js';
import locator  from './app/locator.js';

import Channel from './utils/Channel.js';
import Storage from './utils/Storage.js';

/* eslint-disable */
import LayoutLoading   from '../components/layout/loading.js';
import LayoutLogin     from '../components/layout/login.js';
import LayoutMessenger from '../components/layout/messenger.js';
/* eslint-enable */

// import {
//   reducer as authReducer,
//   applyMiddleware as authApplyMiddleware
// } from '../state/auth/index.js';
// import {reducer as pageReducer} from '../state/pages/index.js';
// import {
//   reducer as dialogsReducer,
//   applyMiddleware as dialogsApplyMiddleware
// } from '../state/dialogs/index.js';
// import {reducer as usersReducer} from '../state/users/index.js';

// const {buildStateStream, combineReducers, dispatchInit, getActionStream} = store;
// const {BehaviorSubject} = rxjs;
// const {map, distinctUntilChanged} = rxjs.operators;

// if (localStorage.getItem('dark') === '1') document.body.classList.add('dark');

// const subject = new BehaviorSubject({});
// const state$ = buildStateStream(combineReducers({
//   page: pageReducer,
//   auth: authReducer,
//   dialogs: dialogsReducer,
//   users: usersReducer
// }));
// const action$ = getActionStream();

// authApplyMiddleware(action$, state$, telegram.connection);
// dialogsApplyMiddleware(action$, state$, telegram.connection);
// state$.subscribe(newState => {
//   console.log('[state]:', newState);
//   subject.next(newState);
// });
// window.getState$ = () => subject;


// const loading = $('layout-loading');
// let current;

main();
async function main() {
  const telegram = new Telegram(config);
  const channel  = new Channel();
  const storage  = new Storage();
  locator.set({config, telegram, channel, storage});

  const router = routing();
  channel.on('$.auth.user', ({user}) => router.check('layout-messenger', user));

  const connection = await telegram.init();
  console.log({connection});

  telegram
    .method('users.getFullUser', {id: {_: 'inputUserSelf'}})
    .then(user => {
      console.log(user);
      channel.send('$.auth.user', {user});
    })
    .catch(() => router.check('layout-login'));

  window.telegram = telegram;
}

// #region [Private]
/** routing */
  function routing() {
    return new Router()
      .route({
        name: 'layout-login',
        check: Router.nameCheck
      })
      .route({
        name: 'layout-messenger',
        check: Router.nameCheck,
        handler: Router.constructorHandler(LayoutMessenger)
      })
      .route({
        name: 'layout-loading',
        default: true
      });
  }
// #endregion
