import telegram, {storage} from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

const { isObjectOf } = zagram;

const component = Component.meta(import.meta.url, 'form-confirm');
const attributes = {}
const properties = {}

export default class FormConfirm extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const input = $('ui-input', node);
    channel.on('authorizationStateWaitCode', () => {
      const phone_number = storage.get('phone_number');
      this.innerText = phone_number;
    });

    input.addEventListener('input', async _ => {
      if (input.value.length < 5) return;
      input.disabled = true;

      const phone_code_hash = await storage.get('phone_code_hash');
      const phone_number    = await storage.get('phone_number');
      const phone_code      = input.value;

      try {
        const response = await telegram.api(
          'auth.signIn',
          { phone_code_hash, phone_number, phone_code }
        );

        console.log('Response', response);

        if (isObjectOf('auth.authorization', response)) {
          console.log('User successfully authorized, go to chat!');
          storage.set('me', response.user);
          channel.send('authorizationStateReady');
        }

        if (isObjectOf('auth.authorizationSignUpRequired', response)) {
          console.log('Emit sign up form');
        }

        wipe.call(this, input);
      } catch (error) {
        console.log('error', error); // "PHONE_CODE_INVALID"
        input.value = '';
        input.disabled = false;
      }
    });

    return this;
  }
}

Component.init(FormConfirm, component, {attributes, properties});

/** */
  function wipe(input) {
    input.disabled = false;
    input.value = '';
  }
