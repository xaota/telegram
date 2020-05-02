/**
  * @typedef { import("../app/config.js").default } Config
  */

import '../../zagram/zagram.js';
import ApiError from './ApiError.js';

import Storage from '../utils/Storage.js';
import ConnectionWrapper from './ConnectionWrapper.js';


// @ts-ignore
// import {MTProto, schema, method, construct} from '../../zagram/zagram.js';
const {schema, method, construct} = zagram;
// +isMessageOf('rpc_error_type'), isObjectOf, CONSTRUCTOR_KEY

/** {Telegram} Работа с Telegram @class @export @default
  */
export default class Telegram extends EventTarget {
  /** {Telegram} Создание объекта для общения с API Telegram @constructor
    * @param {Config} config конфигурация приложения
    */
  constructor(config) {
    super();
    this.config = config;
    this.connect();
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

  request(query) {
    return this.connection.request(query);
  }

  download(inputFileLocation, options = {}) {
    return this.connection.download(inputFileLocation, options);
  }

  upload(file, progressCb) {
    return this.connection.upload(file, progressCb);
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

  /** */
  save() {
    const authKeyStore = this.config.authKeyStore;
    const keys = this.keys;
    if (!keys) return;
    keys.serverSalt = Array.from(keys.serverSalt);
      new Storage(authKeyStore).save(keys);
    }

  /** @private */
  connect() {
    const config = this.config;
    const authKeyStore = config.authKeyStore;
    const authKeyData = authKeyStore
      ? new Storage(authKeyStore).load()
      : undefined;

    const url = config.api.url[config.test ? 'test' : 'prod'];
    const addr = config.socket
      ? 'ws://' + url + 's'
      : 'http://' + url;

    this.connection = new ConnectionWrapper(addr, schema, authKeyData);
    this.connection.addEventListener('statusChanged', e => {
      const event = new Event('statusChanged');
      event.status = R.clone(e.status);
      event.detail = R.clone(e.detail);
      this.dispatchEvent(event);
    });
    this.connection.addEventListener('telegramUpdate', e => {
      const event = new Event('telegramUpdate');
      event.detail = R.clone(e.detail);
      this.dispatchEvent(event);
    });
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

    telegram.once('statusChanged', ({status, detail}) => {
      if (status !== 'AUTH_KEY_CREATED') {
        return reject(status); // AUTH_KEY_CREATE_FAILED, AUTH_KEY_ERROR
      }
      telegram.keys = detail;
      resolve(status); // AUTH_KEY_CREATED
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
