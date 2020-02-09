import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';

import UIIcon    from '../../ui/icon/ui-icon.js';
import UIInput   from '../../ui/input/ui-input.js';
import UIButton  from '../../ui/button/ui-button.js';
import UISticker from '../../ui/sticker/ui-sticker.js';

const component = Component.meta(import.meta.url, 'form-confirm');
const attributes = {

  }

const properties = {

  }

export default class FormConfirm extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const input = $('ui-input', node);
    input.addEventListener('input', _ => {
      // console.log(input.value);
      if (input.value.length < 5) return;
      console.log(input.value);
      input.disabled = true;
      // loader ?
      setTimeout(() => {
        channel.send('login-confirm');
        wipe.call(this, input);
      }, 2000); // +user
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
