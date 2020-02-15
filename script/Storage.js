export default class Storage {
  constructor(name = 'storage', inMemory = false) {
    this.inMemory = inMemory;
    this.name = name;
    this.data = {};
  }

  get(key) {
    // return new Promise((resolve, reject) => {
      const data = this.load();
      const value = data[key];
      // console.log(this.name, 'storage get', {key, value}, data);
      return value;
      // resolve(value);
    // });
  }

  set(key, value) {
    // return new Promise((resolve, reject) => {
      const data = this.load();
      data[key] = value;
      this.save(data);
      // console.log(this.name, 'storage set', {key, value}, data);
      // resolve();
    // });
  }

  remove(...keys) {
    // return new Promise((resolve, reject) => {
      const data = this.load();
      keys.forEach(key => delete data[key]);
      this.save(data);
      // console.log(this.name, 'storage remove', keys, data);
      // resolve();
    // });
  }

  clear() {
    // return new Promise((resolve, reject) => {
      // console.log(this.name, 'storage clear');
      this.save();
      // resolve();
    // });
  }

  //

  load() {
    return this.inMemory
      ? this.data
      : load(this.name);
  }

  save(data = {}) {
    this.inMemory
      ? this.data = data
      : save(this.name, data);
  }
}

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
