import Storage from '../script/Storage.js';
import Channel from '../script/Channel.js';

const TdClient = window.tdweb.default;

const config = {
  api_id: 905423,
  api_hash: '3beebd95a9a78b35f4dc296fa1b7d8fd'
}

const use_test_dc = false;

const options = {
  prefix: use_test_dc ? 'tdlib_test' : 'tdlib'
  // localstorage
}

function databaseExists(dbname, callback) {
  var req = indexedDB.open(dbname);
  var existed = true;
  req.onsuccess = function() {
    req.result.close();
    if (!existed) indexedDB.deleteDatabase(dbname);
    callback(existed);
  };
  req.onupgradeneeded = function() {
    existed = false;
  };
}

const channel = new Channel();

class Telegram {
  constructor() {
    this.parameters = {
      useTestDC: use_test_dc,
      readOnly: false,
      verbosity: 1,
      jsVerbosity: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm'
    };

    this.disableLog = false;
    this.localStorage = true;
    this.channel = new Channel();
  }

  emit(type, data) {
    this.channel.send('tdlib-' + type, data);
  }

  on(type, listener) {
    this.channel.on('tdlib-' + type, listener);
  }

  init(location) {
    // this.setParameters(location);

    const {verbosity, jsVerbosity, useTestDC, readOnly, fastUpdating, useDatabase, mode} = this.parameters;
    const dbName = useTestDC ? 'tdlib_test' : 'tdlib';

    this.client = new TdClient(options);
    this.client.onUpdate = update => this.emit('update', update);

    // databaseExists(dbName, exists => {
    //   this.clientUpdate({'@type': 'clientUpdateTdLibDatabaseExists', exists});

    //   let options = {
    //     logVerbosityLevel: verbosity,
    //     jsLogVerbosityLevel: jsVerbosity,
    //     mode: mode, // 'wasm-streaming'/'wasm'/'asmjs'
    //     prefix: useTestDC ? 'tdlib_test' : 'tdlib',
    //     readOnly: readOnly,
    //     isBackground: false,
    //     useDatabase: useDatabase,
    //     wasmUrl: `${WASM_FILE_NAME}?_sw-precache=${WASM_FILE_HASH}`
    //     // onUpdate: update => this.emit('update', update)
    //   };

    //   console.log(
    //     `[TdLibController] (fast_updating=${fastUpdating}) Start client with params=${JSON.stringify(options)}`
    //   );

    // init

    // });
  }

  clientUpdate(update) {
    if (!this.disableLog) console.log('update client channel', update);
    channel.send('telegram', update);
    return this;
  }

  api(method, params) {
    if (!this.client) return console.error(`tdlib@${method}: !tdlib.init`, params);

    console.log(`tdlib@${method}.request`, params);
    return this.client.send({'@type': method, ...params})
      .then(result => {
        console.log(`tdlib@${method}.response`, result);
        return result;
      })
      .catch(error => {
        console.error(`tdlib@${method}.error`, error);
        throw error;
      })
  }

  async sendTdParameters() {
    const apiId = config.api_id;
    const apiHash = config.api_hash;

    const parameters = {
      '@type': 'tdParameters',
      use_test_dc,
      api_id: apiId,
      api_hash: apiHash,
      system_language_code: 'ru', // navigator.language || 'ru',
      device_model: 'tdlib client web', // window.navigator.platform.name, // getBrowser(),
      system_version: '1.0.0', // window.navigator.platform.os, // getOSName(),
      application_version: '1.0.0',
      // use_secret_chats: false,
      // use_message_database: true,
      // use_file_database: false,
      // database_directory: '/db',
      // files_directory: '/'
    }

    this.api('setTdlibParameters', {parameters});

    if (this.parameters.tag && this.parameters.tagVerbosity) {
      for (let i = 0; i < this.parameters.tag.length; i++) {
        let tag = this.parameters.tag[i];
        let tagVerbosity = this.parameters.tagVerbosity[i];
        this.api('setLogTagVerbosityLevel', {tag, new_verbosity_level: tagVerbosity});
      }
    }
  }

  logOut() {
    this.api('logOut').catch(error => {
      this.emit('tdlib_auth_error', error);
    })
  }

  setChatId(chatId, messageId = null) {
    const update = {
      '@type': 'clientUpdateChatId',
      chatId: chatId,
      messageId: messageId
    };

    this.clientUpdate(update);
  }

  setMediaViewerContent(content) {
    this.clientUpdate({
      '@type': 'clientUpdateMediaViewerContent',
      content: content
    });
  }
}

const telegram = new Telegram();
const storage = new Storage();

export default telegram;
export {config, storage};
