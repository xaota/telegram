import App from './App.js';
import $, {channel} from './DOM.js';
import telegram from '../tdweb/Telegram.js';

import {reducer as authReducer, applyMiddleware as authApplyMiddleware} from '../state/auth/index.js';
import {reducer as pageReducer} from '../state/pages/index.js';

import LayoutLoading from '../component/layout/loading/layout-loading.js';
import LayoutLogin   from '../component/layout/login/layout-login.js';
import LayoutConfirm from '../component/layout/confirm/layout-confirm.js';
import LayoutMain    from '../component/layout/main/layout-main.js';
import LayoutRegister from '../component/layout/register/layout-register.js';
import LayoutPassword from '../component/layout/password/layout-password.js';

const {buildStateStream, combineReducers, dispatchInit, getActionStream} = store;
const {BehaviorSubject} = rxjs;
const {map, distinctUntilChanged} = rxjs.operators;

if (localStorage.getItem('dark') === '1') document.body.classList.add('dark');


const subject = new BehaviorSubject({});
const state$ = buildStateStream(combineReducers({
  page: pageReducer,
  auth: authReducer
}));
const action$ = getActionStream();

authApplyMiddleware(action$, state$, telegram.connection);
state$.subscribe(newState => {
  console.log('[state]:', newState);
  subject.next(newState);
});
window.getState$ = () => subject;


const loading = $('layout-loading');
let current;

main();

const getPageLayout = R.cond([
  [R.equals('login'), R.always(LayoutLogin)],
  [R.equals('verify'), R.always(LayoutConfirm)],
  [R.equals('sign-up'), R.always(LayoutRegister)],
  [R.equals('password'), R.always(LayoutPassword)],
  [R.equals('chat'), R.always(LayoutMain)],
  [R.T, R.always(LayoutLoading)]
]);

function main() {
  new App(telegram, channel); // eslint-disable-line
  const page$ = state$
    .pipe(map(R.prop('page')))
    .pipe(distinctUntilChanged());

  page$.subscribe(page => {
    if (current) {
      current.remove();
    }
    loading.style.display = '';

    const Layout = getPageLayout(page);
    current = createLayout(new Layout());
  });

  window.customElements.whenDefined('layout-register').then(dispatchInit);
}

function createLayout(layout) {
  document.body.appendChild(layout);
  loading.style.display = 'none';
  return layout;
}
