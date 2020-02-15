import telegram, {storage} from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIIcon    from '../../ui/icon/ui-icon.js';
import UIInput   from '../../ui/input/ui-input.js';
import UIButton  from '../../ui/button/ui-button.js';
import UISticker from '../../ui/sticker/ui-sticker.js';

const component = Component.meta(import.meta.url, 'form-confirm');
const attributes = {}
const properties = {}

export default class FormConfirm extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const phone_number = storage.get('phone_number');
    // debugger;
    this.innerText = phone_number;

    const input = $('ui-input', node);
    input.addEventListener('input', async _ => {
      // console.log(input.value);
      if (input.value.length < 5) return;
      // console.log('sms', input.value);
      input.disabled = true;
      // loader ?

      // const phone_code_hash = await storage.get('phone_code_hash');
      // const phone_number    = await storage.get('phone_number');
      // const phone_code      = input.value;

      try {
        // const temp = await telegram.api('auth.signIn', {phone_code_hash, phone_number, phone_code});

        // const {user} = temp;
        // console.log('AUTH', temp);

        // if (user._ === 'user') {
        //   await storage.set('auth', user.id);
        //   await storage.remove('phone_code_hash', 'phone_number');
        // }

        await telegram.api('checkAuthenticationCode', {code: input.value});

        // channel.send('login-confirm', user);
        wipe.call(this, input);
      } catch (error) {
        // console.log('error', error.message); // "PHONE_CODE_INVALID"
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
