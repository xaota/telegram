export default class AppStorage {
    constructor() {
        this.inMemory = false;
        this.data = {};
    }

    get(key) {
        console.log('get s', key);
        return new Promise((resolve, reject) => {
            if (this.inMemory) {
                resolve(this.data[key]);
            } else {
                const value = localStorage.getItem(key);
                resolve(value);
                // value
                //     ? resolve(value)
                //     : reject()
            }
        });
    }

    set(key, value) {
        if (typeof key === 'object') {
            return Promise.all(Object.entries(key).map(([k, v]) => this.set(k, v)));
        }

        console.log('set s', key);
        return new Promise((resolve, reject) => {
            if (this.inMemory) {
                this.data[key] = value;
            } else {
                localStorage.setItem(key, value);
            }
            resolve();
        });
    }

    remove(keys) {
        return new Promise((resolve, reject) => {
            keys.forEach(key => {
                if (this.inMemory) {
                    delete this.data[key];
                } else {
                    localStorage.removeItem(key);
                }
            });
            resolve();
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            if (this.inMemory) {
                this.data = {};
            } else {
                localStorage.clear();
            }
            resolve();
        });
    }
}
