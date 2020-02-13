import File from './File.js';

export default class App {
  constructor(telegram, channel) {
    this.telegram = telegram;
    this.channel = channel;
    this.init();
  }

  init() {
    this.telegram.init();
    this.telegram.on('update', u => this.update(u));
  }

  update(update) {
    const type = update['@type'];

    const handlers = {
      updateFile:               File.update,
      updateConnectionState:    u => this.connection(u.state['@type']),
      updateAuthorizationState: u => this.authorization(u.authorization_state['@type'], u.authorization_state)
    };

    typeof handlers[type] === 'function'
      ? handlers[type](update)
      : console.log('update@' + type, update);
  }

  async connection(type) {
    console.log('connectionState@' + type);
  }

  async authorization(type, state) {
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
