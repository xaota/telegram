import {formatDate, tgDate, wrapAsObjWithKey} from '../helpers.js';
import {userIdToPeerId} from '../../state/users/utils.js';

const {isObjectOf, construct, CONSTRUCTOR_KEY} = zagram;

const getMedia = R.prop('media');

const isMessageWithMediaPhoto = R.pipe(
  getMedia,
  isObjectOf('messageMediaPhoto')
);

const isMessageWithMediaDocument = R.pipe(
  getMedia,
  isObjectOf('messageMediaDocument')
);

const isMessageWithWebPage = R.pipe(
  x => {
    console.log('Get media from: ', x);
    return x;
  },
  getMedia,
  x => {
    console.log('Check: ', x);
    return x;
  },
  isObjectOf('messageMediaWebPage')
);

const getDocument = R.pipe(R.cond([
  [
    isObjectOf('messageMediaPhoto'),
    R.prop('photo')
  ],
  [
    isObjectOf('messageMediaWebPage'),
    R.path(['webpage', 'photo'])
  ],
  [
    R.T,
    R.prop('document')
  ]
]));

const getMediaDocument = R.pipe(getMedia, getDocument);

const getMediaId = R.pipe(getMediaDocument, R.prop('id'));

const getAccessHash = R.pipe(getMediaDocument, R.prop('access_hash'));

const getFileReference = R.pipe(getMediaDocument, R.prop('file_reference'));


export const getThumbObject = R.pipe(
  R.cond([
    [isObjectOf('photo'), R.path(['sizes'])],
    [R.T, R.path(['thumbs'])]
  ]),
  R.filter(isObjectOf('photoSize')),
  R.filter(R.propEq('type', 'm')),
  R.last
);

/**
 * @param {Object} message - telegrams message with media
 * @returns {Object} - information about size preview
 */
export const getThumbObjectFromMessage = R.pipe(
  getMediaDocument,
  getThumbObject
);

/**
 * @param {Object} message - telegrams message with media
 * @returns {Object} - params for building InputFileLocation object
 */
export const buildThumbInputFileParams = R.pipe(
  R.of,
  R.ap([
    R.pick(['id', 'access_hash', 'file_reference']),
    R.pipe(getThumbObject, R.prop('type'), wrapAsObjWithKey('thumb_size'))
  ]),
  R.mergeAll
);

/**
 * @param {Object} message - telegrams message with media
 * @returns {Object} - params for building InputFileLocation object
 */
const buildThumbInputFileParamsFromMessage = R.pipe(
  getMediaDocument,
  buildThumbInputFileParams
);
/**
 * @param {Object} message - telegrams message with messageMediaPhoto
 * @return {Object} - inputPhotoFileLocation object
 */
const buildThumbInputPhotoFileLocation = R.pipe(
  buildThumbInputFileParamsFromMessage,
  R.partial(construct, ['inputPhotoFileLocation'])
);
/**
 * @param {Object} message - telegrams message with messageMediaDocument
 * @return {Object} - inputDocumentFileLocation object
 */
const buildThumbInputDocumentFileLocation = R.pipe(
  buildThumbInputFileParamsFromMessage,
  R.partial(construct, ['inputDocumentFileLocation'])
);
/**
 * param {Object} message - telegrams message with media(photo or video)
 * @return {Object} - object of InputFileLocation to download it
 */
export const buildThumbnailFileLocation = R.cond([
  [isMessageWithMediaPhoto, buildThumbInputPhotoFileLocation],
  [isMessageWithWebPage, buildThumbInputPhotoFileLocation],
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


export const getStickerEmojiFromMessage = R.pipe(
  R.pathOr([], ['media', 'document', 'attributes']),
  R.filter(isObjectOf('documentAttributeSticker')),
  R.nth(0),
  R.propOr('', 'alt')
);


export const isAudioDocument = R.pipe(
  R.prop('attributes'),
  R.filter(isObjectOf('documentAttributeAudio')),
  R.length,
  R.equals(1)
);


/**
 * Returns true if document is sticker
 */
export const isVideoDocument = R.pipe(
  R.prop('attributes'),
  R.filter(isObjectOf('documentAttributeVideo')),
  R.length,
  R.equals(1)
);


/**
 * Returns true if document is sticker
 */
export const isStickerDocument = R.pipe(
  R.prop('attributes'),
  R.filter(isObjectOf('documentAttributeSticker')),
  R.length,
  R.equals(1)
);


/**
 * Returns type of message from document
 * @param {*} - Document
 */
export const getTypeFromDocument = R.cond([
  [isVideoDocument, R.always('messageVideo')],
  [isAudioDocument, R.always('messageAudio')],
  [isStickerDocument, R.always('messageSticker')],
  [R.T, R.always('messageMediaDocument')]
]);


/**
 * Returns 'messageText' if message without media else returns type by
 * message media
 * @param media
 */
export const getTypeFromMedia = R.cond([
  [isObjectOf('messageMediaEmpty'), R.always('messageText')],
  [isObjectOf('messageMediaDocument'), R.pipe(R.prop('document'), getTypeFromDocument)],
  [R.T, R.prop(CONSTRUCTOR_KEY)]
]);


/**
 * Returns 'messageText' if message without media else returns type by
 * message media
 * @param message
 */
export const getCommonMessageType = R.cond([
  [R.has('media'), R.pipe(R.prop('media'), getTypeFromMedia)],
  [R.T, R.always('messageText')]
]);


/**
 * Returns service message type by action constructor:
 * https://core.telegram.org/type/MessageAction
 * @param message
 */
export const getServiceMessageType = R.path(['action', CONSTRUCTOR_KEY]);


/**
 * Returns types of message for function
 * @param message
 */
export const getMessageType = R.cond([
  [isObjectOf('message'), getCommonMessageType],
  [isObjectOf('messageService'), getServiceMessageType]
]);


/**
 * @param {*} message - telegram message or service message object
 * @return {string} - text preview for last message
 */
export function previewMessage(message) {
  const type = getMessageType(message);
  const handlers = {
    messageText: R.prop('message'),
    messageMediaEmpty: R.prop('message'),
    messageMediaWebPage: R.prop('message'),
    messageMediaPoll: () => '📊 Poll',
    messageMediaPhoto: m => '🖼 ' + (m.message || 'Photo'),
    messageVideo:     m => '🎥 ' + (getFilename(m) || 'Video'),
    messageAudio:     m => '🎵 ' + (getFilename(m) || 'Audio'),
    messageSticker: m => 'Sticker ' + getStickerEmojiFromMessage(m),
    messageMediaDocument: () => `Document`,
    // messageAnimation: c => 'GIF',
    messageChatAddMembers: () => 'добавление в чат',
    messageActionContactSignUp: () => 'теперь в телеграм'
  };
  const text = typeof handlers[type] === 'function'
    ? handlers[type](message)
    : 'неподдерживаемое сообщение (' + type + ')';
  return text.split(/\n/)[0];
}
