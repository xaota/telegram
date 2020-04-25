/**
 * Base worker to keep connection
 */
this.window = this;
importScripts('../../lib/ramda.min.js');
importScripts('../../zagram/zagram.js');

const {MTProto} = zagram;

let connection;

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
  console.log('Init connection', connection);
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

const messageHandler = R.cond([
 [isEventOfType('newConnection'), creatNewConnection],
 [isEventOfType('init'), initConnection],
 [isEventOfType('request'), request],
 [R.T, console.warn]
]);

onmessage = messageHandler;
