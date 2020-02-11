// in window: mtproto.MTProto, vendor, bundle/hash.worker?

import Storage from './Storage.js';

const config = {
  api_id:    905423, // 49631
  api_hash: '3beebd95a9a78b35f4dc296fa1b7d8fd'
}

const api = {
  api_id: config.api_id,
  layer: 57,
  initConnection: 0x69796de9,
  app_version   : '1.0.0',
  lang_code     : 'ru',
  // invokeWithLayer: 0xda9b0d0d,
}

const server = {
  // webogram: true,
  // dev: true // We will connect to the test server. Any empty configurations fields can just not be specified
}

/* */
const storeDCItems = (function() {
  const dc = [1,2,3];
  const salt = dc.map(e => `dc${e}_server_salt`);
  const key  = dc.map(e => `dc${e}_auth_key`);
  return [...salt, ...key, 'nearest_dc'];
})();

class Telegram {
  constructor(storage = 'mtproto') {
    this.storage = new Storage(storage);
    this.listeners = [];
  }

  api(method, params = {}, timeout = 15000) {
    console.info(`%c ${method} [${Object.keys(params).join(', ')}]`, 'color: #bada55');
    return new Promise((resolve, reject) => {
      this.client(method, params)
        .then(resolve)
        .catch(reject);
      // todo: if (...errors.length >= 3) => reject({code: 429, message: method + ': Flood'})
      setTimeout(_ => reject({code: 500, message: method + ': MTPTimeout'}), timeout);
    });
  }

  async init() {
    const app = {
      storage: this.storage
    };

    this.client = window.mtproto.MTProto({server, api, app});
    // this.errors = 0;

    await Telegram.ready(this.storage);
    return this;
  }

  on(event, listener) {
    if (this.client) this.client.on(event, listener);
    return this;
  }

  async drop() {
    await this.storage.clear();
    this.client = null;
    return this;
  }

  static ready(storage, cooldown = 15e3, timeout = 1e3) {
    return new Promise((resolve, reject) => {
      setTimeout(async _ => {
        const status = await Telegram.status(storage);
        if (status) return resolve();
        cooldown -= timeout;
        if (cooldown <= 0) return reject({code: 666, message: 'MTProto ready timeout'});
        try {
          await Telegram.ready(storage, cooldown, timeout);
          resolve()
        } catch(e) {
          reject(e);
        }
      }, timeout);
    });
  }

  static async status(storage) {
    return await Promise
      .allSettled(storeDCItems.map(e => storage.get(e)))
      .then(array => array.some(e => Boolean(e)));
  }
}

const storage  = new Storage();
const telegram = new Telegram();
// const storageMTProto = new Storage('mtproto');

// const app = {
//   storage: storageMTProto
// };
// const MTPClient = window.mtproto.MTProto({server, api, app});

// export const mtp = () => window.mtproto.MTProto({server, api, app});

// export default function telegram(method, params = {}, timeout = 15000) {
//   console.info(`%c ${method} [${Object.keys(params).join(', ')}]`, 'color: #bada55');
//   return new Promise((resolve, reject) => {
//     MTPClient(method, params)
//       .then(resolve)
//       .catch(reject);
//     // todo: if (...errors.length >= 3) => reject({code: 429, message: method + ': Flood'})
//     setTimeout(_ => reject({code: 500, message: method + ': MTPTimeout'}), timeout);
//   });
// }
// telegram.on = MTPClient.on;

export default telegram;
export {
  config,

  // storageMTProto as mtproto,
  storage,

  // MTPClient as tg

  // +password()
  // +telegram() as default
};

window.telegram = telegram; // !
// window.tg = MTPClient;
// window.mtp = mtp;
// MTPClient.mtproto.on('*', e => console.log('mtproto event', e));

/**
 * @param {UInt8Array} salt
 * @param {string} password
 * @return {Promise}
 */
export function password(salt, password) {
  const utf = new TextEncoder().encode(password);

  const final = new Uint8Array(salt.length * 2 + utf.length);
  final.set(salt, 0);
  final.set(utf, salt.length);
  final.set(salt, salt.length + utf.length);

  return window.mtproto.CryptoWorker.sha256Hash(final);
}
