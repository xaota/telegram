import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'app-message');
const attributes = {}
const properties = {}

export default class AppMessage extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    return this;
  }

  static preview(message) {
    const type = message.content['@type'];
    const handlers = {
      messageText:      c => c.text.text,
      messagePoll:      c => '📊 Poll',
      messagePhoto:     c => '🖼 ' + (c.caption && c.caption.text || 'Photo'),
      messageVideo:     c => '🎥 ' + (c.caption && c.caption.text || 'Video'),
      messageAudio:     c => '🎵 ' + c.audio.title || 'Audio',
      messageSticker:   c =>  'Sticker ' + c.sticker.emoji,
      messageDocument:  c => `Document (${c.document.file_name})`,
      messageAnimation: c => 'GIF',
      messageChatAddMembers:    c => 'добавление в чат',
      messageContactRegistered: c => 'теперь в телеграм',
    };
    const text = typeof handlers[type] === 'function'
      ? handlers[type](message.content)
      : 'неподдерживаемое сообщение (' + type + ')';
    return text.split(/\n/)[0];
  }

  static timestamp(timestamp) {
    if (!timestamp) return '';
    try{
      timestamp = new Date(timestamp * 1000);
      return [timestamp.getHours(), timestamp.getMinutes()]
        .map(e => ('0' + e).slice(-2))
        .join(':');
    } catch (e) {
      debugger;
    }
  }
}

Component.init(AppMessage, component, {attributes, properties});
