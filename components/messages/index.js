import MessagePhoto from './photo.js';
import MessageText from './text.js';
import MessageWebPage from './web-page.js';
import MessageUnexpected from './unexpected.js';
import {getMessageType} from '../../script/utils/message.js';


const getMessageClass = R.cond([
  [R.equals('messageMediaPhoto'), R.always(MessagePhoto)],
  [R.equals('messageText'), R.always(MessageText)],
  [R.equals('messageMediaWebPage'), R.always(MessageWebPage)],
  [R.T, R.always(MessageUnexpected)]
]);


/**
 * @param {*} message - message or tmp message object
 * @returns {HTMLElement} - element of message
 */
export default function messageFactory(message) {
  console.log(`----- Message: ${message.id} -----`);
  console.log('Type: ', getMessageType(message));
  console.log(message);
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

  console.log(messageNode);
  console.log(`------------`);
  return messageNode;
}
