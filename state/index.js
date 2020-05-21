import {
  reducer as authReducer,
  applyMiddleware as authApplyMiddleware
} from './auth/index.js';
import {reducer as pageReducer} from './pages/index.js';
import {
  reducer as dialogsReducer,
  applyMiddleware as dialogsApplyMiddleware
} from './dialogs/index.js';
import {
  reducer as usersReducer,
  applyMiddleware as usersApplyMiddleware
} from './users/index.js';
import {
  reducer as chatsReducer,
  applyMiddleware as chatsApplyMiddleware
} from './chats/index.js';
import {reducer as uiReducer} from './ui/index.js';
import {
  reducer as stickersReducer,
  applyMiddleware as stickersApplyMiddleware
} from './stickers/index.js';
import telegramUpdateMiddleware from './telegramUpdateMiddleware.js';

const {buildStateStream, combineReducers, getActionStream} = store;
const {BehaviorSubject} = rxjs;
const {debounceTime} = rxjs.operators;


export default function init(connection) {
  const baseSubject = new BehaviorSubject({});
  const state$ = buildStateStream(combineReducers({
    page: pageReducer,
    ui: uiReducer,
    auth: authReducer,
    dialogs: dialogsReducer,
    users: usersReducer,
    chats: chatsReducer,
    stickers: stickersReducer
  }));
  const action$ = getActionStream();

  state$.subscribe(newState => {
    console.log('[state]:', new Date(), newState);
    baseSubject.next(newState);
  });

  const throttleSubject = new BehaviorSubject({});
  baseSubject.pipe(debounceTime(17)).subscribe(x => throttleSubject.next(x));

  window.getState$ = () => throttleSubject;

  R.map(
    middleware => middleware(action$, baseSubject, connection),
    [
      authApplyMiddleware,
      dialogsApplyMiddleware,
      chatsApplyMiddleware,
      usersApplyMiddleware,
      telegramUpdateMiddleware,
      stickersApplyMiddleware
    ]
  );
}

