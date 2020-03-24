import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import { sendAuthCode } from '../../../state/auth/index.js';

import UILogo     from '../../ui/logo/ui-logo.js';
import UIInput    from '../../ui/input/ui-input.js';
import UIButton   from '../../ui/button/ui-button.js';
import UICountry  from '../../ui/country/ui-country.js';
import UICheckbox from '../../ui/checkbox/ui-checkbox.js';


const { map, distinctUntilChanged } = rxjs.operators;

const component = Component.meta(import.meta.url, 'form-login');
const attributes = {}
const properties = {}

const getErrorLabel = R.cond([
  [R.equals('PHONE_NUMBER_INVALID'), R.always('Invalid phone number')],
  [R.T, R.identity],
]);

const getErrorCode = R.pathOr(null, ['auth', 'sendAuthCodeError']);

/**
 * Takes error code from current state, and return human readable label
 */
const getError = R.pipe(
  getErrorCode,
  getErrorLabel,
)

export default class FormLogin extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const phone = $('#phone', node);
    const button = $('ui-button', node);

    const sendingAuthCode$ = getState$()
      .pipe(map(R.pathOr(false, ['auth', 'sendingAuthCode'])))
      .pipe(distinctUntilChanged());

    sendingAuthCode$.subscribe((sending) => {
      console.log(`[form-login] sending: ${sending}`);
      phone.disabled = sending;
      button.loading = sending;
    })

    const sendAuthCodeError$ = getState$()
      .pipe(map(getError))
      .pipe(distinctUntilChanged())

    sendAuthCodeError$.subscribe((error) => {
      console.log(`[form-login] error: ${error}`);
      phone.error = error;
    });


    phone.addEventListener('change', _ => {
      button.style.display = phone.value.length > 0 ? 'block' : 'none';
    });

    button.addEventListener('click', async _ => {
      const phoneNumber = phone.value;
      sendAuthCode(phoneNumber);
    });

    return this;
  }
}

Component.init(FormLogin, component, {attributes, properties});

/** */
  function wipe(phone, button) {
    phone.value = '';
    button.loading = false;
    button.style.display = 'none';
  }
