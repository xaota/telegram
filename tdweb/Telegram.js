import Storage from '../script/Storage.js';
import Channel from '../script/Channel.js';

const { MTProto, schema, method } = zagram;

const url = 'http://149.154.167.40/apiw';

const config = {
  api_id: 905423,
  api_hash: '3beebd95a9a78b35f4dc296fa1b7d8fd'
}

const channel = new Channel();

class Telegram {
  constructor() {
    this.channel = new Channel();
    this.connection = new MTProto(url, schema);
    console.log(this.connection);
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
    this.emitConnectionStatus(e.status);
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
