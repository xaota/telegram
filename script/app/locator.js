/**
 * @typedef { import("./config.js").default } Config
 * @typedef { import("./Telegram.js").default } Telegram
 * @typedef { import("../utils/Channel.js").default } Channel
 * @typedef { import("../utils/Storage.js").default } Storage
 */

/** {Locator} DI @class @export @default
  *
  */
  export class Locator {
  /** {Locator} DI @constructor
    */
    constructor() {
      this.services = {};
    }

  /** @section services list */
  /** config
    * @return {Config}
    */
    get config() {
      return this.services.config;
    }

  /** telegram
    * @return {Telegram}
    */
    get telegram() {
      return this.services.telegram;
    }

  /** channel
    * @return {Channel}
  */
    get channel() {
      return this.services.channel;
    }

  /** storage
    * @return {Storage}
    */
    get storage() {
      return this.services.storage;
    }

  /** @section services setting */
  /** */
    set(services) {
      Object.assign(this.services, services);
      return this;
    }

  /** */
    get(name) {
      return this.services[name];
    }
  }

/** */
  export default new Locator();
