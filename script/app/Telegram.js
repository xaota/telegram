import ApiError from './ApiError.js';

// @ts-ignore
const {MTProto, schema, method, construct} = zagram; // +isMessageOf('rpc_error_type')

/** {Telegram} Работа с Telegram @class @export @default
  *
  */
  export default class Telegram {
  /** {Telegram} Создание объекта для общения с API Telegram @constructor
    */
    constructor(config) {
      this.config = config;
      this.connection = new MTProto(config.api.url, schema);
    }

  /** @fields */
    get connected() {
      return this.connection.status === 'AUTH_KEY_CREATED';
    }

  /** */
    on(event, listener) {
      this.connection.addEventListener(event, listener);
      return this;
    }

  /** */
    off(event, listener) {
      this.connection.removeEventListener(event, listener);
      return this;
    }

  /** */
    filter(event, filter, callback) {
      const listener = e => filter(e) && callback(e);
      return this.on(event, listener);
    }

  /** */
    once(event, listener) {
      this.connection.addEventListener(event, listener, {once: true});
      return this;
    }

  /** / method */
    async method(name, data) {
      try {
        data = constructing(data);
        const query = method(name, data);
        return await this.connection.request(query);
      } catch (error) {
        throw ApiError.from(error);
      }
    }

  /** */
    async init() {
      try {
        await connect(this);

        const initConnectionData = {
          ...this.config.app,
          api_id: this.config.api.id,
          query: method('help.getConfig')
        };

        return invoke(this, 'initConnection', initConnectionData);
      } catch (error) {
        const status = error.message;
        console.error(status);
      }
    }
  }

// #region [Private]
/** / constructing */
  function constructing(data, type) {
    const keys = Object
      .keys(data)
      .filter(key => typeof data[key] === 'object');

    keys.forEach(key => {
      const item = data[key];
      data[key] = constructing(item, item._);
    });

    return type
      ? construct(type, data)
      : data;
  }

/** / connect @async */
  function connect(telegram) {
    return new Promise((resolve, reject) => {
      telegram.connection.init(); // @event statusChanged

      telegram.once('statusChanged', ({status}) => {
        telegram.connected
          ? resolve(status) // AUTH_KEY_CREATED
          : reject(status); // AUTH_KEY_CREATE_FAILED, AUTH_KEY_ERROR
      });
    });
  }

/** / invoke @async */
  function invoke(telegram, call, data = {}) {
    const invokeWithLayerData = {
      layer: telegram.config.layer,
      query: method(call, data)
    };
    const request = method('invokeWithLayer', invokeWithLayerData);
    return telegram.connection.request(request);
  }

// #endregion
