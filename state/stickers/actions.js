import {
  GET_ALL_STICKERS,
  SET_ALL_STICKER_SETS,
  LOAD_STICKER_SET,
  SET_DOCUMENT,
  SET_DOCUMENT_BATCH,
  SET_STICKER_PACKS
} from './constants.js';

const {dispatch} = store;

export const getAllStickers = R.partial(dispatch, [GET_ALL_STICKERS]);
export const setAllStickerSets = R.partial(dispatch, [SET_ALL_STICKER_SETS]);
export const loadStickerSet = R.partial(dispatch, [LOAD_STICKER_SET]);
export const setDocument = R.partial(dispatch, [SET_DOCUMENT]);
export const setDocumentBatch = R.partial(dispatch, [SET_DOCUMENT_BATCH]);
export const setStickerPacks = R.partial(dispatch, [SET_STICKER_PACKS]);
