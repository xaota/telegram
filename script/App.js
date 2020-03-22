import File from './File.js';

export default class App {
  constructor(telegram, channel) {
    this.telegram = telegram;
    this.channel = channel;
    this.config = undefined;
    this.init();
  }

  init() {
    this.telegram.init();
    this.telegram.on('update', u => this.update(u));
  }

  update(update) {
    const type = update['@type'];

    console.group(`[APP] Update: ${type}`);
    console.log(update);
    console.groupEnd();

    const handlers = {
      updateFile:                  File.update,

      chatEvent:                   u => console.log('chatEvent', u),

      updateNewChat:               u => this.updateNewChat(u.chat), // новый чат (вообще среди всех списков)
      updateChatChatList:          u => this.updateChatChatList({chat_id: u.chat_id, chat_list: u.chat_list['@type']}), // помещение чата в список чатов

      updateNewMessage:            u => this.updateNewMessage(u.message),

      chatEventPermissionsChanged: u => console.log('chatEventPermissionsChanged', u),
      updateSupergroup:            u => console.log('updateSupergroup', u),

      updateUserStatus:            u => this.updateUserStatus(u), // изер в сети / оффлайн
      updateChatOnlineMemberCount: u => this.updateChatOnlineMemberCount(u), // юзер в сети / оффлайн
      updateChatPermissions:       u => this.updateChatPermissions(u),

      updateChatReadInbox:         u => this.updateChatReadInbox(u), // прочитанно / непрочитано в чате из списка
      updateChatReadOutbox:        u => this.updateChatReadOutbox(u), // пользователь прочитал исходящее сообщение
      updateChatLastMessage:       u => this.updateChatLastMessage(u), // превью сообщения в списке чатов
      updateConnectionState:       u => this.connection(u.state['@type']), // интернет
      updateAuthorizationState:    u => this.authorization(u.authorization_state['@type'], u.authorization_state) // шаги авторизации
    };

    typeof handlers[type] === 'function'
      ? handlers[type](update)
      : true; // console.log('update@' + type, update); // true;
  }

  updateNewMessage(message) {
    this.channel.send('message.new', message);
  }

  updateNewChat(chat) {
    this.channel.send('chat.new', chat);
  }

  updateChatChatList({chat_id, chat_list}) {
    this.channel.send('list.chat', {chat_id, chat_list});
  }

  updateChatReadInbox({chat_id, last_read_inbox_message_id, unread_count}) {
    this.channel.send('chat.counter', {chat_id, last_read_inbox_message_id, unread_count});
  }

  updateChatReadOutbox({chat_id, last_read_outbox_message_id}) {
    // console.log('todo: updateChatReadOutbox', {chat_id, last_read_outbox_message_id}); //
  }

  updateChatLastMessage({chat_id, last_message, order}) {
    console.log('updateChatLastMessage');
    this.channel.send('chat.message', {chat_id, last_message}); // order?
  }

  updateUserStatus({user_id, status}) {
    const online = status['@type'].slice(10).toLowerCase() === 'online';
    const was_online = status.was_online;
    const expires = status.expires;
    this.channel.send('user.status', {user_id, online, was_online, expires});
  }

  updateChatOnlineMemberCount({chat_id, online_member_count}) {
    console.log('update@ChatOnlineMemberCount -> chat.online', {chat_id, online_member_count});
    this.channel.send('chat.online', {chat_id, online_member_count});
  }

  updateChatPermissions({chat_id, permissions}) {
    console.log('update@ChatPermissions', {chat_id, permissions});
    this.channel.send('chat.permissions', {chat_id, permissions});
  }

  connection(type) {
    this.channel.send('connection.state', {type: type.slice(15).toLowerCase()});
  }

  async authorization(type, state) {
    console.log(`[APP] authorization ${type}`);
    const telegram = this.telegram;
    const channel  = this.channel;

    switch(type) {
      case 'authorizationStateWaitTdlibParameters': // -> SetTdlibParameters
        await telegram.sendTdParameters();
        break;
      case 'authorizationStateWaitEncryptionKey': // -> CheckDatabaseEncryptionKey
        await telegram.api('checkDatabaseEncryptionKey');
        break;
      case 'authorizationStateWaitPhoneNumber': // -> SetAuthenticationPhoneNumber
        channel.send('authorizationStateWaitPhoneNumber');
        break;
      // authorizationStateWaitOtherDeviceConfirmation -> "Please confirm this login link on another device: " + state.Link
      case 'authorizationStateWaitCode': // -> CheckAuthenticationCode
        channel.send('authorizationStateWaitCode');
        break;
      case 'authorizationStateReady': // -> show Main
        channel.send('authorizationStateReady');
        break;
      // authorizationStateLoggingOut
      case 'authorizationStateClosed': // logout complete
        // this.telegram.init();
        // this.init();
        window.location.reload();
        break;
      default:
        console.log('authorizationState@' + type, state);
    }
  }
}
