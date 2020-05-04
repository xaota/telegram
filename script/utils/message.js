import {wrapAsObjWithKey, formatDate, tgDate} from '../helpers.js';
import {userIdToPeerId} from '../../state/users/utils.js';

const {isObjectOf, construct} = zagram;

const getMedia = R.prop('media');

const isMessageWithMediaPhoto = R.pipe(
  getMedia,
  isObjectOf('messageMediaPhoto')
);

const isMessageWithMediaDocument = R.pipe(
  getMedia,
  isObjectOf('messageMediaDocument')
);

const getDocument = R.pipe(R.cond([
  [
    isObjectOf('messageMediaPhoto'),
    R.prop('photo')
  ],
  [R.T, R.prop('document')]
]));

const getMediaDocument = R.pipe(getMedia, getDocument);

const getMediaId = R.pipe(getMediaDocument, R.prop('id'));

const getAccessHash = R.pipe(getMediaDocument, R.prop('access_hash'));

const getFileReference = R.pipe(getMediaDocument, R.prop('file_reference'));

/**
 * @param {Object} message - telegrams message with media
 * @returns {Object} - information about size preview
 */
const getThumbObject = R.pipe(
  getMediaDocument,
  R.cond([
    [isObjectOf('photo'), R.path(['sizes'])],
    [R.T, R.path(['thumbs'])]
  ]),
  R.filter(isObjectOf('photoSize')),
  R.last
);

/**
 * @param {Object} message - telegrams message with media
 * @returns {Object} - params for building InputFileLocation object
 */
const buildThumbInputFileParams = R.pipe(
  R.of,
  R.ap([
    R.pipe(getMediaId, wrapAsObjWithKey('id')),
    R.pipe(getAccessHash, wrapAsObjWithKey('access_hash')),
    R.pipe(getFileReference, wrapAsObjWithKey('file_reference')),
    R.pipe(getThumbObject, R.prop('type'), wrapAsObjWithKey('thumb_size'))
  ]),
  R.mergeAll
);
/**
 * @param {Object} message - telegrams message with messageMediaPhoto
 * @return {Object} - inputPhotoFileLocation object
 */
const buildThumbInputPhotoFileLocation = R.pipe(
  buildThumbInputFileParams,
  R.partial(construct, ['inputPhotoFileLocation'])
);
/**
 * @param {Object} message - telegrams message with messageMediaDocument
 * @return {Object} - inputDocumentFileLocation object
 */
const buildThumbInputDocumentFileLocation = R.pipe(
  buildThumbInputFileParams,
  R.partial(construct, ['inputDocumentFileLocation'])
);
/**
 * param {Object} message - telegrams message with media(photo or video)
 * @return {Object} - object of InputFileLocation to download it
 */
export const buildThumbnailFileLocation = R.cond([
  [isMessageWithMediaPhoto, buildThumbInputPhotoFileLocation],
  [isMessageWithMediaDocument, buildThumbInputDocumentFileLocation]
]);

/**
 * param {Object} message - telegrams message with photo
 * @return {Object} - object of InputFileLocation to download original photo
 */
export const buildInputPhotoFileLocation = R.pipe(
  R.of,
  R.ap([
    R.pipe(getMediaId, wrapAsObjWithKey('id')),
    R.pipe(getAccessHash, wrapAsObjWithKey('access_hash')),
    R.pipe(getFileReference, wrapAsObjWithKey('file_reference')),
    R.always({'thumb_size': 0})
  ]),
  R.mergeAll,
  R.partial(construct, ['inputPhotoFileLocation'])
);


/* eslint-disable */
export function humanFileSize(bytes) {
  const thresh = 1024;
  if(Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = ['kB','MB','GB','TB','PB','EB','ZB','YB']
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1)+' '+units[u];
}
/* eslint-enable*/

export const getFilename = R.pipe(
  getMediaDocument,
  R.prop('attributes'),
  R.filter(isObjectOf('documentAttributeFilename')),
  R.pathOr('file', [0, 'file_name'])
);


export const getFileSize = R.pipe(
  getMediaDocument,
  R.prop('size')
);

export const getReadableFileSize = R.pipe(
  getFileSize,
  humanFileSize
);

/**
 * Takes message and returns input document file location object
 */
export const buildInputDocumentFileLocation = R.pipe(
  getMediaDocument,
  R.pick(['id', 'file_reference', 'access_hash']),
  R.merge({'thumb_size': 0}),
  R.partial(construct, ['inputDocumentFileLocation'])
);

export const getUserIdFromMessage = R.prop('from_id');

export const getPeerIdFromMessage = R.pipe(
  getUserIdFromMessage,
  userIdToPeerId
);

const getMessageDate = R.pipe(
  R.prop('date'),
  tgDate
);

export const getMessageDateStr = R.pipe(
  getMessageDate,
  formatDate
);
