import App from './App.js';
import $, {channel} from './DOM.js';
import telegram, {storage} from '../tdweb/Telegram.js';

import LayoutLoading from '../component/layout/loading/layout-loading.js';
import LayoutLogin   from '../component/layout/login/layout-login.js';
import LayoutMain    from '../component/layout/main/layout-main.js';

//
if (localStorage.getItem('dark') === '1') document.body.classList.add('dark');

const loading = $('layout-loading');
let current;

main();

async function main() {
  // await telegram.init();
  // telegram.on('*', e => { console.log('telegram update', e) });
  new App(telegram, channel);

  // this.emit('update', update)
  const layout = new LayoutLogin();

  // const layout = await hasAuth()
  //   .then(_ => new LayoutMain())
  //   .catch(_ => new LayoutLogin());

  current = createLayout(layout);
}

channel.on('authorizationStateReady', async () => {
  current.remove(); // layout-login
  loading.style.display = '';
  // await storage.set('user', user);
  const me = await telegram.api('getMe');
  storage.set('me', me);
  current = createLayout(new LayoutMain());
});

channel.on('user.logout', async _ => {
  current.remove(); // layout-main
  loading.style.display = '';
  await storage.clear();
  await telegram.api('logOut');
  current = createLayout(new LayoutLogin());
});

channel.on('user.loading', _ => loading.style.display = '');

function createLayout(layout) {
  document.body.appendChild(layout);
  loading.style.display = 'none';
  return layout;
}
