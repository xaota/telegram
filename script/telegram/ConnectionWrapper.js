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
    this.progressCbMap = {};
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
      'download_error': this.handleError.bind(this),
      'download_progress': this.handleProgress.bind(this),
      'upload_success': this.handleUploadSuccess.bind(this),
      'upload_error': this.handleError.bind(this),
      'upload_progress': this.handleProgress.bind(this)
    };
    const messageType = getMessageType(e);

    const handle = R.propOr(console.warn, messageType, handlers);

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
    delete this.promiseMap[uid];
    delete this.progressCbMap[uid];
  }

  handleError({uid, error}) {
    const {reject} = this.promiseMap[uid];
    reject(error);
    delete this.promiseMap[uid];
    delete this.progressCbMap[uid];
  }

  handleProgress({uid, args}) {
    const progressCb = R.propOr(R.identity, uid, this.progressCbMap);
    progressCb(...args);
  }

  handleUploadSuccess({uid, result}) {
    const {resolve} = this.promiseMap[uid];
    resolve(result);
    delete this.promiseMap[uid];
    delete this.progressCbMap[uid];
  }

  /**
   * @param {*} obj - request object that will be send to telegrams server
   * @return {Promise<unknown>}
   */
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

  /**
   * @param {Object} obj - telegrams object of type InputFileLocation
   * @param {Function} [progressCb] - callback to track downloading progress
   * @param {Object} options - other options
   * @return {{cancel: (function(): void), promise: Promise<unknown>}} - function
   * to cancel downloading, and promise with result of downloading
   */
  download(obj, {progressCb = R.identity, ...options} = {} ) {
    const uid = randomString();
    const promise =  new Promise((resolve, reject) => {
      this.promiseMap[uid] = {resolve, reject};
      this.progressCbMap[uid] = progressCb;
      this.worker.postMessage({
        type: 'download',
        payload: {
          uid,
          data: obj,
          options
        }
      });
    });

    return {promise, cancel: () => this.cancelDownload(uid)};
  }

  /* eslint-disable class-methods-use-this */
  cancelDownload(uid) {
    this.worker.postMessage({
      type: 'cancel_download',
      payload: uid
    });
  }
  /* eslint-enable class-methods-use-this */

  /**
   * @param {File} file - file that should be uploaded to telegrams server
   * @param {Function} [progressCb] - function to track uploading progress
   * @return {{cancel: (function(): *), promise: Promise<unknown>}} - cancel func and result promise
   */
  upload(file, progressCb) {
    const uid = randomString();
    const promise = new Promise((resolve, reject) => {
      this.promiseMap[uid] = {resolve, reject};
      this.progressCbMap[uid] = progressCb;
      this.worker.postMessage({
        type: 'upload',
        payload: {
          uid,
          file
        }
      });
    });
    return {promise, cancel: () => this.cancelUpload(uid)};
  }

  cancelUpload(uid) {
    this.worker.postMessage({
      type: 'cancel_upload',
      payload: uid
    });
  }
}
