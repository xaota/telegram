import {
  reducer as authReducer,
  applyMiddleware as authApplyMiddleware
} from './auth/index.js';
import {reducer as pageReducer} from './pages/index.js';
import {
  reducer as dialogsReducer,
  applyMiddleware as dialogsApplyMiddleware
} from './dialogs/index.js';
import {reducer as usersReducer} from './users/index.js';
import {reducer as chatsReducer} from './chats/index.js';

const {buildStateStream, combineReducers, dispatchInit, getActionStream} = store;
const {BehaviorSubject} = rxjs;
const {map, distinctUntilChanged} = rxjs.operators;


export default function init(connection) {
  const subject = new BehaviorSubject({});
  const state$ = buildStateStream(combineReducers({
    page: pageReducer,
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
  authApplyMiddleware(action$, getState$(), connection);
  dialogsApplyMiddleware(action$, getState$(), connection);
}

