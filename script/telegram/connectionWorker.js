/**
 * Base worker to keep connection
 */
this.window = this;
importScripts('../../lib/ramda.min.js');
importScripts('../../zagram/zagram.js');

const {MTProto} = zagram;

let connection;

const cancelMap = {};

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


function removeCancelMethod(uid) {
  delete cancelMap[uid];
}

function sendDownloadedFile(uid, file) {
  postMessage({
    type: 'download_success',
    payload: {
      uid,
      file
    }
  });
}

function sendDownloadFileError(uid, error) {
  postMessage({
    type: 'download_error',
    payload: {
      uid,
      error
    }
  });
}

function download(e) {
  const {uid, data, options = {}} = getPayload(e);
  const progressCb = R.partial(handleDownloadProgress, [uid]);
  const {promise, cancel} = connection.download(data, {progressCb, ...options});

  cancelMap[uid] = cancel;

  promise
    .then(R.partial(sendDownloadedFile, [uid]))
    .catch(R.partial(sendDownloadFileError, [uid]))
    .finally(R.partial(removeCancelMethod, [uid]));
}

function cancelUploadDownloadProcess(e) {
  const uid = getPayload(e);
  const cancel = R.propOr(R.identity, uid, cancelMap);
  cancel();
}


function handleUploadProgress(uid, ...args) {
  postMessage({
    type: 'upload_progress',
    payload: {uid, args}
  });
}

function handleUploadSuccess(uid, result) {
  postMessage({
    type: 'upload_success',
    payload: {uid, result}
  });
}

function handleUploadError(uid, error) {
  postMessage({
    type: 'upload_error',
    payload: {uid, error}
  });
}

function upload(e) {
  const {uid, file} = getPayload(e);
  const progressCb = R.partial(handleUploadProgress, [uid]);
  const {promise, cancel} = connection.upload(file, progressCb);

  cancelMap[uid] = cancel;

  promise
    .then(R.partial(handleUploadSuccess, [uid]))
    .catch(R.partial(handleUploadError, [uid]))
    .finally(R.partial(removeCancelMethod, [uid]));
}

const messageHandler = R.cond([
 [isEventOfType('newConnection'), creatNewConnection],
 [isEventOfType('init'), initConnection],
 [isEventOfType('request'), request],
 [isEventOfType('download'), download],
 [isEventOfType('cancel_download'), cancelUploadDownloadProcess],
 [isEventOfType('upload'), upload],
 [isEventOfType('cancel_upload'), cancelUploadDownloadProcess],
 [R.T, console.warn]
]);

onmessage = messageHandler;
