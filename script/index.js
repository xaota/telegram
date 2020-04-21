import Router   from './ui/Router.js';
import Telegram from './telegram/Telegram.js';

import config   from './app/config.js';
import locator  from './app/locator.js';

import Channel from './utils/Channel.js';
import Storage from './utils/Storage.js';

import initState from '../state/index.js';

/* eslint-disable */
import LayoutLoading   from '../components/layout/loading.js';
import LayoutLogin     from '../components/layout/login.js';
import LayoutMessenger from '../components/layout/messenger.js';
/* eslint-enable */

const {map, distinctUntilChanged} = rxjs.operators;


main();
async function main() {
  const telegram = new Telegram(config);
  const channel  = new Channel();
  const storage  = new Storage();
  locator.set({config, telegram, channel, storage});
  initState(telegram.connection);
  const router = routing();

  const page$ = getState$().pipe(
    map(R.propOr('loading', 'page')),
    distinctUntilChanged()
  );

  page$.subscribe(openedPage => {
    if (openedPage === 'loading') {
      router.check('layout-loading');
    }

    if (openedPage === 'login') {
      router.check('layout-login');
    }

    if (openedPage === 'chat') {
      router.check('layout-messenger');
    }
  });
  await telegram.init();

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
