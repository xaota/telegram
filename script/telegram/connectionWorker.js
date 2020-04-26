/**
 * Base worker to keep connection
 */
this.window = this;
importScripts('../../lib/ramda.min.js');
importScripts('../../zagram/zagram.js');

const {MTProto} = zagram;

let connection;

const cancelDownloadMap = {};

const isEventOfType = R.pipe(
  R.equals,
  R.curry(R.binary(R.pipe))(R.path(['data', 'type']))
);

/**
 * Gets payload from MessageEvent
 * @param {MessageEvent}
 * @return {*}
 */
const getPayload = R.path(['data', 'payload']);

/**
 * Creates new telegram connection with serverUrl, schema, authData from event
 * @param {MessageEvent} e
 */
function creatNewConnection(e) {
  const {serverUrl, schema, authData} = getPayload(e);
  connection = new MTProto(serverUrl, schema, authData);
  connection.addEventListener('statusChanged', e => {
    postMessage({
      type: 'event',
      payload: {
        type: 'statusChanged',
        status: e.status,
        detail: e.detail
      }
    });
  });
}

function initConnection() {
  connection.init();
}

/**
 *
 * @param {string} uid - uid of promise
 * @param {*} response - result from telegram server
 */
function sendResponse(uid, response) {
  postMessage({
    type: 'response',
    payload: {
      uid,
      response
    }
  });
}

/**
 * Send request to telegram
 * @param {MessageEvent} e
 */
function request(e) {
  const {uid, data} = getPayload(e);
  connection
    .request(data)
    .then(R.partial(sendResponse, [uid]))
    .catch(R.partial(sendResponse, [uid]));
}

/* eslint-disable no-empty-function */
function handleDownloadProgress(uid, ...args) {
  postMessage({
    type: 'download_progress',
    payload: {uid, args}
  });
}
/* eslint-enable no-empty-function */


function removeDownloadCancelMethod(uid) {
  delete cancelDownloadMap[uid];
}

function sendDownloadedFile(uid, file) {
  postMessage({
    type: 'download_success',
    payload: {
      uid,
      file
    }
  });
  removeDownloadCancelMethod(uid);
}

function sendDownloadFileError(uid, error) {
  postMessage({
    type: 'download_error',
    payload: {
      uid,
      error
    }
  });
  removeDownloadCancelMethod(uid);
}

/**
 * Start downloading process
 * @param e
 */
function download(e) {
  const {uid, data, options = {} } = getPayload(e);
  const progressCb = R.partial(handleDownloadProgress, [uid]);
  const {promise, cancel} = connection.download(data, { progressCb, ...options });

  cancelDownloadMap[uid] = cancel;

  promise
    .then(R.partial(sendDownloadedFile, [uid]))
    .catch(R.partial(sendDownloadFileError, [uid]));
}


function cancelDownload(e) {
  const uid = getPayload(e);
  const cancel = R.propOr(R.identity, uid, cancelDownloadMap);
  cancel();
}

const messageHandler = R.cond([
 [isEventOfType('newConnection'), creatNewConnection],
 [isEventOfType('init'), initConnection],
 [isEventOfType('request'), request],
 [isEventOfType('download'), download],
 [isEventOfType('cancel_download'), cancelDownload],
 [R.T, console.warn]
]);

onmessage = messageHandler;
