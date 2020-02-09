import $, {channel} from './DOM.js';

import LayoutLoading from '../component/layout/loading/layout-loading.js';
import LayoutLogin   from '../component/layout/login/layout-login.js';
import LayoutMain    from '../component/layout/main/layout-main.js';

const loading = $('layout-loading');
let current = createLayout(new LayoutMain());
// let current = createLayout(new LayoutLogin());

channel.on('user.login', _ => {
  current.remove(); // layout-login
  loading.style.display = '';
  current = createLayout(new LayoutMain());
});

channel.on('user.logout', _ => {
  current.remove(); // layout-main
  loading.style.display = '';
  current = createLayout(new LayoutLogin());
});

channel.on('user.loading', _ => loading.style.display = '');

function createLayout(layout) {
  document.body.appendChild(layout);
  loading.style.display = 'none';
  return layout;
}
