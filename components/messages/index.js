import MessagePhoto from './photo.js';
import MessageText from './text.js';
import {getTimestamp} from '../../script/helpers.js';

/**
 * @param {*} message - message or tmp message object
 * @returns {HTMLElement} - element of message
 */
export default function messageFactory(message) {
  const messageNode = message?.media?.photo
    ? new MessagePhoto(message.media.photo)
    : new MessageText();

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

  const span = document.createElement('span');
  span.setAttribute('slot', 'content');
  span.innerText = R.propOr('', 'message', message);
  messageNode.appendChild(span);

  messageNode.timestamp = getTimestamp(message.date);

  if (message?.media?.webpage) {
    messageNode?.webpage(message.media.webpage);
  }

  return messageNode;
}
