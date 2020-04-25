import '../../zagram/zagram.js';

const {isRpcError} = zagram;

const randomString = () => (
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)
);

const getMessageType = R.path(['data', 'type']);
const getPayload = R.path(['data', 'payload']);

/**
 * Class that implements interface of MTProto connection
 * allows to work with connection that runs in worker
 */
export default class ConnectionWrapper extends EventTarget {
  constructor(serverUrl, schema, authData) {
    super();
    this.promiseMap = {};
    this.worker = new Worker('./script/telegram/connectionWorker.js');
    this.worker.onmessage = this.handleMessage.bind(this);
    this.worker.postMessage({
      type: 'newConnection',
      payload: {serverUrl, schema, authData}
    });
  }

  init() {
    this.worker.postMessage({
      type: 'init'
    });
  }

  handleMessage(e) {
    const handlers = {
      'event': this.handleEvent.bind(this),
      'response': this.handleResponse.bind(this),
      'download_success': this.handleDownloadSuccess.bind(this),
      'download_error': this.handleDownloadError.bind(this)
    };
    const messageType = getMessageType(e);

    const handle = R.propOr(R.identity, messageType, handlers);

    handle(getPayload(e));
  }

  handleEvent(payload) {
    if (payload.type === 'statusChanged') {
      const event = new Event('statusChanged');
      event.status = payload.status;
      event.detail = payload.detail;
      this.dispatchEvent(event);
    }
  }

  handleResponse({uid, response}) {
    const {resolve, reject} = this.promiseMap[uid];

    if (isRpcError(response)) {
      reject(response);
    } else {
      resolve(response);
    }

    delete this.promiseMap[uid];
  }

  handleDownloadSuccess({uid, file}) {
    const {resolve} = this.promiseMap[uid];
    resolve(file);
  }

  handleDownloadError({uid, error}) {
    const {reject} = this.promiseMap[uid];
    reject(error);
  }

  request(obj) {
    const uid = randomString();
    return new Promise((resolve, reject) => {
      this.promiseMap[uid] = {resolve, reject};
      this.worker.postMessage({
        type: 'request',
        payload: {
          uid,
          data: obj
        }
      });
    });
  }

  download(obj, progessCb) {
    const uid = randomString();
    const promise =  new Promise((resolve, reject) => {
      this.promiseMap[uid] = {resolve, reject};
      this.worker.postMessage({
        type: 'download',
        payload: {
          uid,
          data: obj
        }
      });
    });

    return {promise, cancel: () => this.cancelDownload(uid)};
  }

  /* eslint-disable class-methods-use-this */
  cancelDownload(uid) {
    console.warn('Cancel downloading not implemented yet');
  }
  /* eslint-enable class-methods-use-this */
}
