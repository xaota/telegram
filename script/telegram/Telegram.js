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
    this.connections = {};
    R.pipe(
      R.prop('dcs'),
      R.keys,
      R.map(dcId => this.connect(dcId))
    )(this.config);
    this.authKeyStores = {};
    this.mainDc = 1;
  }

  get connection() {
    return this.connections[this.mainDc];
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
  init() {
    const initConnectionData = {
      ...this.config.app,
      api_id: this.config.api.id,
      query: method('help.getConfig')
    };
    const promises = R.pipe(
      R.keys,
      R.map(dcId => this
          .initConnectionDc(dcId)
          .then(x => invoke(this, x, 'initConnection', initConnectionData))
          .then(() => this.connections[dcId].request(method('help.getNearestDc')))
          .then(R.prop('nearest_dc')))
    )(this.connections);

    return Promise.all(promises)
      .then(mainDcs => {
        const mainDc = R.nth(0, mainDcs);
        console.log('Main dc:', mainDc);
        this.mainDc = mainDc;

        this.connection.addEventListener('telegramUpdate', e => {
          const event = new Event('telegramUpdate');
          event.detail = e.detail;
          this.dispatchEvent(event);
        });

        const event = new Event('statusChanged');
        event.status = 'AUTH_KEY_CREATED';

        this.dispatchEvent(event);
      });
  }

  initConnectionDc(dcId) {
    return connect(this, dcId).then(R.always(dcId));
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
  connect(dcId) {
    const config = this.config;
    const dcConfig = this.config.dcs[dcId];
    const authKeyStore = dcConfig.authKeyStore;
    const authKeyData = authKeyStore ? new Storage(authKeyStore).load() : undefined;
    const url = config.test ? dcConfig.test : dcConfig.prod;

    this.connections[dcId] = new ConnectionWrapper(url, schema, authKeyData);
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
function connect(telegram, dcId) {
  return new Promise((resolve, reject) => {
    telegram.connections[dcId].init(); // @event statusChanged

    telegram.connections[dcId].addEventListener('statusChanged', ({status, detail}) => {
      if (status !== 'AUTH_KEY_CREATED') {
        return reject(status); // AUTH_KEY_CREATE_FAILED, AUTH_KEY_ERROR
      }
      telegram.authKeyStores[dcId] = detail;
      resolve(status); // AUTH_KEY_CREATED
    });
  });
}

/** / invoke @async */
function invoke(telegram, dcId, call, data = {}) {
  const invokeWithLayerData = {
    layer: telegram.config.layer,
    query: method(call, data)
  };
  const request = method('invokeWithLayer', invokeWithLayerData);
  return telegram.connections[dcId].request(request);
}

// #endregion
