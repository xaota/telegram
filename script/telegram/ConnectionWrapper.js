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
    const messageType = getMessageType(e);
    console.log('message', messageType);
    if (messageType === 'event') {
      this.handleEvent(getPayload(e));
    }
    if (messageType === 'response') {
      this.handleResponse(getPayload(e));
    }
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
    console.log('Handle response', uid, response);
    console.log(this.promiseMap[uid]);
    const {resolve, reject} = this.promiseMap[uid];

    if (isRpcError(response)) {
      reject(response);
    } else {
      resolve(response);
    }

    delete this.promiseMap[uid];
  }

  request(obj) {
    return new Promise((resolve, reject) => {
      const uid = randomString();
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
}
