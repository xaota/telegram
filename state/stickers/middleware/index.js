import loadAllStickerSetsMiddleware from './loadAllStickerSetsMiddleware.js';
import loadStickerSetMiddleware from './loadStickerSetMiddleware.js';

export default function applyMiddleware(action$, state$, connection) {
  loadAllStickerSetsMiddleware(action$, state$, connection);
  loadStickerSetMiddleware(action$, state$, connection);
}
