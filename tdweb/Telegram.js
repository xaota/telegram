import Storage from '../script/Storage.js';
import Channel from '../script/Channel.js';
import { wrapAsObjWithKey } from '../script/helpers.js';

const { MTProto, schema, method } = zagram;


const url = 'http://149.154.167.40/apiw';

export const LOCAL_STORAGE_AUTH_KEY = 'telegramAuthData';

const config = {
  api_id: 905423,
  api_hash: '3beebd95a9a78b35f4dc296fa1b7d8fd'
}


const channel = new Channel();


const buildJsonAuthData = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('authKey'), Array.from, wrapAsObjWithKey('authKey')),
    R.pipe(R.prop('authKeyId'), Array.from, wrapAsObjWithKey('authKeyId')),
    R.pipe(R.prop('serverSalt'), Array.from, wrapAsObjWithKey('serverSalt')),
  ]),
  R.mergeAll,
  JSON.stringify,
);


const saveToLocalStorage = R.pipe(
  buildJsonAuthData,
  (x) => localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, x),
);

const loadFromLocalStorage = R.pipe(
  (x) => localStorage.getItem(LOCAL_STORAGE_AUTH_KEY),
  JSON.parse,
);

class Telegram {
  constructor() {
    this.channel = new Channel();
    const authKeyData = loadFromLocalStorage();
    console.log(authKeyData);
    this.connection = new MTProto(url, schema, authKeyData);
  }

  emit(type, data) {
    this.channel.send('tdlib-' + type, data);
  }

  on(type, listener) {
    this.channel.on('tdlib-' + type, listener);
  }

  init() {
    this.connection.addEventListener('statusChanged', this.sendTdParameters.bind(this));
    this.connection.init();
  }

  clientUpdate(update) {
    channel.send('telegram', update);
    return this;
  }

  /**
   * @param {string} methodName - method that will be called in telegram server
   * @param {*} params - object with params for callable method
   * @returns {Promise<T>}
   */
  api(methodName, params) {
    if (!this.connection || this.connection.status !== 'AUTH_KEY_CREATED') {
      return Promise.reject(new Error('No connection'));
    }

    return this.connection.request(method(methodName, params));
  }

  async sendTdParameters(e) {
    if (e.status === 'AUTH_KEY_CREATED') {
      saveToLocalStorage(e.detail);
      const parameters = {
        layer: 108,
        query: method(
          'initConnection',
          {
            api_id: config.api_id,
            device_model: navigator.userAgent,
            system_version: navigator.platform,
            app_version: '0.0.1',
            system_lang_code: navigator.language,
            lang_pack: '',
            lang_code: 'ru-ru',
            query: method('help.getConfig')
          },
        ),
      }

      this.api('invokeWithLayer', parameters)
        .then(this.handleTdParamsHasBeenSet.bind(this))
        .catch(this.handleTdParamsSetError.bind(this));
    }
    this.emitConnectionStatus(e.status);
  }

  emitConnectionStatus(status) {
    this.emit('update', {
      '@type': 'updateConnectionState',
      state: { '@type': status },
    });
  }

  async handleTdParamsHasBeenSet(config) {
    this.emit(
      'update',
      {
        '@type': 'updateAuthorizationState',
        authorization_state: {
          '@type': 'authorizationStateWaitPhoneNumber',
        },
    });
  }

  async handleTdParamsSetError(error) {
    console.warn('[SET PARAMS ERROR]:', error);
  }

  logOut() {
    this.api('logOut').catch(error => {
      this.emit('tdlib_auth_error', error);
    })
  }

  setChatId(chatId, messageId = null) {
    const update = {
      '@type': 'clientUpdateChatId',
      chatId: chatId,
      messageId: messageId
    };

    this.clientUpdate(update);
  }

  setMediaViewerContent(content) {
    this.clientUpdate({
      '@type': 'clientUpdateMediaViewerContent',
      content: content
    });
  }
}

const telegram = new Telegram();
const storage = new Storage('storage', true);

window.telegram = telegram; // TODO убрать
export default telegram;
export {config, storage};
