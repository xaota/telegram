/** Шина обмена событиями @browser @custom-events @event-driven @bus @sub @channel
  *
  */
  export default class Channel {
  /** {Events} создание инстанса @constructor
    * @param {string} name название канала
    * @param {boolean} singleton если установлен, запрещает создать новый инстанс, если уже есть созданный с таким флагом
    */
    constructor(name = 'default', singleton = true) {
      const instance = singleton === true && Channel.instance && Channel.instance instanceof Channel;
      if (instance) return Channel.instance;
      if (singleton === true) Channel.instance = this;

      this.name = name;
      this.channel = new EventTarget();
    }

    static instance = undefined;

  /** Добавление подписчика на событие / on @addEventListener
    * @param {String} type название события
    * @param {Function} callback обработчик события
    * @return {Function} установленный обработчик
    */
    on(type, callback) {
      const listener = e => callback(e.detail);
      this.channel.addEventListener(type, listener);
      return listener;
    }

  /** */
    filter(type, filter, callback) {
      const listener = e => filter(e) && callback(e);
      return this.on(type, listener);
    }

  /** Удаление подписчика на событие / off @removeEventListener @TODO:
    * @param {String} type название события
    * @param {EventListenerObject} listener обработчик события {Function}
    * @return {Channel} @this шина
   */
    off(type, listener) {
      this.channel.removeEventListener(type, listener);
      return this;
    }

  /** Добавление одноразового подписчика на событие / on / once @addEventListener
    * @param {string} type название события
    * @param {Function} callback обработчик события
    * @return {Channel} @this
    */
    once(type, callback) {
      const listener = e => callback(e.detail);
      this.channel.addEventListener(type, listener, {once: true});
      return this;
    }

  /** Отправка события в шину (запуск обработчиков) / send @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @return {Channel} @this
    */
    send(event, detail = null) {
      this.channel.dispatchEvent(new CustomEvent(event, {detail}));
      return this;
    }

  /** */
    async(event, detail = null, cooldown = 0) {
      setTimeout(_ => this.send(event, detail), cooldown);
      return this;
    }
}

