import MessagePhoto from './photo.js';
import MessageVideo from './video.js';
import MessageText from './text.js';
import MessageWebPage from './web-page.js';
import MessageUnexpected from './unexpected.js';
import MessageSticker from './sticker.js';
import MessageDocument from './document.js';
import MessageTmpText from './tmp-text.js';
import MessageTmpMedia from './tmp-media.js';
import {getMessageType} from '../../script/utils/message.js';


const getMessageClass = R.cond([
  [R.equals('messageMediaPhoto'), R.always(MessagePhoto)],
  [R.equals('tmpMessageText'), R.always(MessageTmpText)],
  [R.equals('tmpMessageMedia'), R.always(MessageTmpMedia)],
  [R.equals('messageVideo'), R.always(MessageVideo)],
  [R.equals('messageText'), R.always(MessageText)],
  [R.equals('messageMediaWebPage'), R.always(MessageWebPage)],
  [R.equals('messageSticker'), R.always(MessageSticker)],
  [R.equals('messageMediaDocument'), R.always(MessageDocument)],
  [R.T, R.always(MessageUnexpected)]
]);


/**
 * @param {*} message - message or tmp message object
 * @returns {HTMLElement} - element of message
 */
export default function messageFactory(message) {
  const type = getMessageType(message);

  const MessageClass = getMessageClass(type);
  const messageNode = new MessageClass(message);

  // media:
  // webpage:
  // @@constructor: "webPage"
  // @@type: "WebPage"
  // id: 5127856301970688130n
  // url: "https://youtu.be/UEwCD8PjrZI"
  // display_url: "youtube.com/watch?v=UEwCD8PjrZI"
  // hash: 0
  // type: "video"
  // site_name: "YouTube"
  // title: "Лох,Пидор"
  // description: "опасный поцик"
  // photo
  // embed_url: "https://www.youtube.com/embed/UEwCD8PjrZI"
  // embed_type: "iframe"
  // embed_width: 480
  // embed_height: 360

  if (message.out) {
    messageNode.setAttribute('right', true);
  } else {
    messageNode.setAttribute('left', true);
  }
  return messageNode;
}
