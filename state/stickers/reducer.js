import {SET_ALL_STICKER_SETS, SET_DOCUMENT_BATCH} from './constants.js';
import {getState, getActionPayload, applyAll} from '../utils.js';

const {isActionOf, buildReducer} = store;


const handleSetAllStickerSet = R.pipe(
  applyAll([
    R.always(R.lensProp('stickerSets')),
    R.pipe(
      getActionPayload,
      R.prop('sets')
    ),
    getState
  ]),
  R.apply(R.set)
);


const buildDocumentLens = R.pipe(
  R.path(['set', 'id']),
  R.toString,
  R.of,
  R.concat(['stickerSetDocuments']),
  R.lensPath
);


const handleSetDocumentBatch = R.pipe(
  applyAll([
    R.pipe(getActionPayload, buildDocumentLens),
    R.pipe(
      getActionPayload,
      R.prop('documents')
    ),
    getState
  ]),
  R.apply(R.set)
);

export default buildReducer({}, [
  [isActionOf(SET_ALL_STICKER_SETS), handleSetAllStickerSet],
  [isActionOf(SET_DOCUMENT_BATCH), handleSetDocumentBatch]
]);
