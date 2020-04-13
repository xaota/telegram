import Router   from './ui/Router.js';
import Telegram from './app/Telegram.js';

import config   from './app/config.js';
import locator  from './app/locator.js';

import Channel from './utils/Channel.js';
import Storage from './utils/Storage.js';

import LayoutLoading   from '../components/layout/loading.js';
import LayoutLogin     from '../components/layout/login.js';
import LayoutMessenger from '../components/layout/messenger.js';

main();
async function main() {
  const telegram = new Telegram(config);
  const channel  = new Channel();
  const storage  = new Storage();
  locator.set({config, telegram, channel, storage});

  const router = routing();

  const connection = await telegram.init();
  // console.log({connection});
  if (telegram.connected) router.check('layout-login');

  locator.channel.on('$.auth.user', ({user}) => router.check('layout-messenger', user));
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
