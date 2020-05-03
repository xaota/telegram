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
    return this.connection.request(query).catch(e => {
      console.log('Caught error', e);
      if (
        R.propEq('errorMessage', 'PHONE_MIGRATE_1', e) ||
        R.propEq('errorMessage', 'NETWORK_MIGRATE_1', e) ||
        R.propEq('errorMessage', 'USER_MIGRATE_1', e)
      ) {
        this.setMainDc(1);
        return this.connections[1].request(query);
      }
      if (
        R.propEq('errorMessage', 'PHONE_MIGRATE_2', e) ||
        R.propEq('errorMessage', 'NETWORK_MIGRATE_2', e) ||
        R.propEq('errorMessage', 'USER_MIGRATE_2', e)
      ) {
        this.setMainDc(2);
        return this.connections[2].request(query);
      }
      if (
        R.propEq('errorMessage', 'PHONE_MIGRATE_3', e) ||
        R.propEq('errorMessage', 'NETWORK_MIGRATE_3', e) ||
        R.propEq('errorMessage', 'USER_MIGRATE_3', e)
      ) {
        this.setMainDc(3);
        return this.connections[3].request(query);
      }
      if (
        R.propEq('errorMessage', 'PHONE_MIGRATE_4', e) ||
        R.propEq('errorMessage', 'NETWORK_MIGRATE_4', e) ||
        R.propEq('errorMessage', 'USER_MIGRATE_4', e)
      ) {
        this.setMainDc(4);
        return this.connections[4].request(query);
      }
      if (
        R.propEq('errorMessage', 'PHONE_MIGRATE_5', e) ||
        R.propEq('errorMessage', 'NETWORK_MIGRATE_5', e) ||
        R.propEq('errorMessage', 'USER_MIGRATE_5', e)
      ) {
        this.setMainDc(5);
        return this.connections[5].request(query);
      }
      return Promise.reject(e);
    });
  }

  exportAuth() {
    const isNotMainDc = R.pipe(
      R.equals(R.toString(this.mainDc)),
      R.not
    );

    const promises = R.pipe(
      R.keys,
      R.filter(isNotMainDc),
      R.map(x => parseInt(x, 10)),
      R.map(x => Number(x)),
      R.map(dcId => this.exportAuthToDc(dcId).catch(() => { console.log(`Can't export to dc ${dcId}`); }))
    )(this.connections);

    return Promise.all(promises);
  }

  exportAuthToDc(dcId) {
    console.log(`Export from ${this.mainDc} to ${dcId}`);

    if (this.mainDc === dcId) {
      Promise.reject(new Error('Can`t export authorization to same dc'));
    }
    return this.connections[this.mainDc].request(method('auth.exportAuthorization', {dc_id: dcId}))
      .then(exportValue => method('auth.importAuthorization', exportValue))
      .then(importRequest => this.connections[dcId].request(importRequest));
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
        this.setMainDc(mainDc);
        const event = new Event('statusChanged');
        event.status = 'AUTH_KEY_CREATED';

        this.dispatchEvent(event);
      });
  }

  initConnectionDc(dcId) {
    return connect(this, dcId).then(R.always(dcId));
  }

  setMainDc(dcId) {
    this.connection.removeEventListener('telegramUpdate', this.handleTelegramUpdate.bind(this));
    this.mainDc = dcId;
    this.connection.addEventListener('telegramUpdate', this.handleTelegramUpdate.bind(this));
  }

  handleTelegramUpdate(e) {
    const event = new Event('telegramUpdate');
    event.detail = e.detail;
    this.dispatchEvent(event);
  }


  /** */
  save() {
    R.pipe(
      R.keys,
      R.map(this.saveDcAuth.bind(this))
    )(this.connections);
  }

  saveDcAuth(dcId) {
    const authKeyStore = this.config.dcs[dcId].authKeyStore;
    const keys = this.authKeyStores[dcId];
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
