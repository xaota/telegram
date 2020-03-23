import Component from '../../../script/Component.js'

const { isObjectOf, CONSTRUCTOR_KEY } = zagram

const component = Component.meta(import.meta.url, 'app-message')
const attributes = {}
const properties = {}

/**
 * Returns 'messageText' if message without media else returns type by
 * message media
 * @param message
 */
function getCommonMessageType(message) {
  const { media } = message;
  if (media) {
    return media[CONSTRUCTOR_KEY];
  }
  return 'messageText';
}

/**
 * Returns service message type by action constructor:
 * https://core.telegram.org/type/MessageAction
 * @param message
 */
function getServiceMessageType(message) {
  const { action } = message;
  return action[CONSTRUCTOR_KEY];
}

/**
 * Returns types of message for function
 * @param message
 */
function getMessageType(message) {
  if (isObjectOf('message', message)) {
    return getCommonMessageType(message);
  }

  if (isObjectOf('messageService', message)) {
    return getServiceMessageType(message);
  }

  console.warn('Not a message!', message)
}

export default class AppMessage extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this
  }

  static preview(message) {
    const type = getMessageType(message)
    console.log(type);
    const handlers = {
      messageText: m => m.message,
      messageMediaPoll: () => '📊 Poll',
      messageMediaPhoto:     m => '🖼 ' + (m.message || 'Photo'),
      // messageVideo:     c => '🎥 ' + (c.caption && c.caption.text || 'Video'),
      // messageAudio:     c => '🎵 ' + c.audio.title || 'Audio',
      // messageSticker:   c =>  'Sticker ' + c.sticker.emoji,
      messageMediaDocument:  () => `Document`,
      // messageAnimation: c => 'GIF',
      messageChatAddMembers:    () => 'добавление в чат',
      messageActionContactSignUp: () => 'теперь в телеграм',
    }
    const text = typeof handlers[type] === 'function'
      ? handlers[type](message)
      : 'неподдерживаемое сообщение (' + type + ')'
    return text.split(/\n/)[0]
  }

  static timestamp(timestamp) {
    if (!timestamp) return ''
    try {
      timestamp = new Date(timestamp * 1000)
      return [timestamp.getHours(), timestamp.getMinutes()]
        .map(e => ('0' + e).slice(-2))
        .join(':')
    } catch (e) {
      debugger;
    }
  }
}

Component.init(AppMessage, component, { attributes, properties })
