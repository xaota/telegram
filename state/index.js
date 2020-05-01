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
import telegramUpdateMiddleware from './telegramUpdateMiddleware.js';

const {buildStateStream, combineReducers, getActionStream} = store;
const {BehaviorSubject} = rxjs;


export default function init(connection) {
  const subject = new BehaviorSubject({});
  const state$ = buildStateStream(combineReducers({
    page: pageReducer,
    ui: uiReducer,
    auth: authReducer,
    dialogs: dialogsReducer,
    users: usersReducer,
    chats: chatsReducer
  }));
  const action$ = getActionStream();

  state$.subscribe(newState => {
    console.log('[state]:', newState);
    subject.next(newState);
  });
  window.getState$ = () => subject;
  R.map(
    middleware => middleware(action$, getState$(), connection),
    [
      authApplyMiddleware,
      dialogsApplyMiddleware,
      chatsApplyMiddleware,
      usersApplyMiddleware,
      telegramUpdateMiddleware
    ]
  );
}

