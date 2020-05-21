import {getStickerSetId} from './utils.js';

const {map} = rxjs.operators;
/**
 * @param {Observable<*>} state$ - state of application
 * @returns {Observable<Array<*>>} - returns list
 */
export function getStickerSets$(state$) {
  return state$.pipe(map(R.pathOr([], ['stickers', 'stickerSets'])));
}

/**
 * @param {Observable<*>} state$ - state of application
 * @param {*} stickerSet - telegrams stickers set of object
 * @returns {Observable<Array<*>>} - returns list of sticker set documents
 */
export function stickerSetDocument$(state$, stickerSet) {
  const getDocuments = R.pathOr(
    [],
    [
      'stickers',
      'stickerSetDocuments',
      getStickerSetId(stickerSet)
    ]
  );

  return state$.pipe(map(getDocuments));
}
