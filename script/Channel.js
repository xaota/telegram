/** Шина обмена событиями @browser @custom-events @event-driven
  *
  */
  export default class Channel {
  /** {Events} создание инстанса @constructor
    * @param {boolean} singleton если установлен, запрещает создать новый инстанс, если уже есть созданный с таким флагом
    * @param {string} element название DOM элемента для отслеживания событий
    */
    constructor(singleton = true, element = 'eventselement') {
      const instance = singleton === true && Channel.instance && Channel.instance instanceof Channel;
      if (instance) return Channel.instance;
      this.channel = document.createElement(element);
      if (singleton === true) Channel.instance = this;
    }

  /** Добавление подписчика на событие / on @addEventListener
    * @param {string} event название события
    * @param {function} callback обработчик события
    * @param {object|boolean} options характеристики обработчика
    * @return {Channel} @this
    */
    on(event, callback, options = false) {
      const handler = ({detail}) => callback(detail);
      this.channel.addEventListener(event, handler, options);
      return this;
    }

  /** Удаление подписчика на событие / off @removeEventListener @TODO:
    * @param {string} event название события
    * @param {function} callback обработчик события
    * @param {object|boolean} options характеристики обработчика
    * @return {Channel} @this
   */
    off(event, callback, options = false) {
      this.channel.removeEventListener(event, callback, options);
      return this;
    }

  /** Добавление одноразового подписчика на событие / on / once @addEventListener
    * @TODO: mdn
    * @param {string} event название события
    * @param {function} callback обработчик события
    * @return {Channel} @this
    */
    once(event, callback) {
      return this.subscribe(event, callback, {once: true});
    }

  /** Отправка события в шину (запуск обработчиков) / send @dispatchEvent
    * @param {string} event название события
    * @param {any} detail параметры события
    * @return {Channel} @this
    */
    send(event, detail = {}) {
      this.channel.dispatchEvent(new CustomEvent(event, {detail}));
      return this;
    }

  /** */
    async(event, detail = {}, cooldown = 0) {
      setTimeout(_ => this.send(event, detail), cooldown);
      return this;
    }
}
