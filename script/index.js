import App from './App.js';
import $, {channel} from './DOM.js';
import telegram, {storage} from '../tdweb/Telegram.js';

import { reducer as authReducer, applyMiddleware as authApplyMiddleware } from '../state/auth/index.js';
import { reducer as pageReducer } from '../state/pages/index.js';

import LayoutLoading from '../component/layout/loading/layout-loading.js';
import LayoutLogin   from '../component/layout/login/layout-login.js';
import LayoutMain    from '../component/layout/main/layout-main.js';

const { buildStateStream, combineReducers, dispatchInit, getActionStream, isActionOf } = store;
const { map, distinctUntilChanged } = rxjs.operators;

if (localStorage.getItem('dark') === '1') document.body.classList.add('dark');


window.state$ = buildStateStream(combineReducers({
  page: pageReducer,
  auth: authReducer,
}));

window.action$ = getActionStream();
authApplyMiddleware(action$, state$, telegram.connection);
state$.subscribe((state) => { console.log('[state]:', state)});


const loading = $('layout-loading');
let current;

main();

const getPageLayout = R.cond([
  [R.equals('login'), R.always(LayoutLogin)],
  [R.equals('main'), R.always(LayoutMain)],
  [R.T, R.always(LayoutLoading)]
])

async function main() {
  new App(telegram, channel);
  const page$ = state$
    .pipe(map(R.prop('page')))
    .pipe(distinctUntilChanged());

  page$.subscribe((page) => {
    if (current) {
      current.remove();
    }
    loading.style.display = '';

    const Layout = getPageLayout(page);
    current = createLayout(new Layout());
  });

  window.customElements.whenDefined('layout-login').then(dispatchInit);
}

function createLayout(layout) {
  document.body.appendChild(layout);
  loading.style.display = 'none';
  return layout;
}
