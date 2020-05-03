export default {
  api: {
    id: 905423,
    hash: '3beebd95a9a78b35f4dc296fa1b7d8fd',

    url: {
      test: '149.154.167.40/apiw',
      prod: '149.154.167.50/apiw'
    }
  },

  // http://(name)(-1).web.telegram.org:80/api(w)(s)(_test)
  dcs: {
    1: {
      test: 'ws://pluto.web.telegram.org/apiws_test',
      prod: 'ws://pluto.web.telegram.org/apiws',
      authKeyStore: 'authKeyStore1'
    },
    2: {
      test: 'ws://venus.web.telegram.org/apiws_test',
      prod: 'ws://venus.web.telegram.org/apiws',
      authKeyStore: 'authKeyStore2'
    },
    3: {
      test: 'ws://aurora.web.telegram.org/apiws_test',
      prod: 'ws://aurora.web.telegram.org/apiws',
      authKeyStore: 'authKeyStore3'
    },
    4: {
      test: 'ws://vesta.web.telegram.org/apiws_test',
      prod: 'ws://vesta.web.telegram.org/apiws',
      authKeyStore: 'authKeyStore4'
    },
    5: {
      test: 'ws://flora.web.telegram.org/apiws_test',
      prod: 'ws://flora.web.telegram.org/apiws',
      authKeyStore: 'authKeyStore5'
    }
  },

  test: false,
  layer: 108,
  socket: true,
  authKeyStore: 'authKeyStore',

  app: {
    app_version: '0.0.1',
    device_model: navigator.userAgent,
    system_version: navigator.platform,
    system_lang_code: navigator.language,
    lang_pack: '',
    lang_code: 'ru-RU'
  }
};
