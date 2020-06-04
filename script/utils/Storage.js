/** */
  export default class Storage {
  /** */
    constructor(name = 'default', inMemory = false) {
      this.inMemory = inMemory;
      this.name = name;
      this.data = {};
    }

  /** */
    get(key) {
      const data = this.load();
      const value = data[key];
      return value;
    }

  /** */
    set(key, value) {
      const data = this.load();
      data[key] = value;
      return this.save(data);
    }

  /** */
    remove(...keys) {
      const data = this.load();
      keys.forEach(key => delete data[key]);
      return this.save(data);
    }

  /** */
    clear() {
      return this.save();
    }

  /** @section api */
  /** */
    load() {
      return this.inMemory
        ? this.data
        : load(this.name);
    }

  /** */
    save(data = {}) {
      this.inMemory
        ? this.data = data
        : save(this.name, data);
      return this;
    }
  }

// #region [Private]
/** */
  function load(name) {
    const item = localStorage.getItem(name);
    const data = JSON.parse(item || '{}');
    return data;
  }

/** */
  function save(name, data = {}) {
    const item = JSON.stringify(data);
    localStorage.setItem(name, item);
  }
// #endregion
