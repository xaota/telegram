import telegram, {storage} from '../../../tdweb/Telegram.js';

import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import { setPage } from '../../../state/pages/index.js';
import { sendVerifyCode } from '../../../state/auth/index.js';

const { fromEvent } = rxjs;
const { filter, mapTo, map, distinctUntilChanged } = rxjs.operators;
const { isObjectOf } = zagram;

const component = Component.meta(import.meta.url, 'form-confirm');
const attributes = {}
const properties = {}

const goToLogin = R.partial(setPage, ['login']);

const getPhoneNumber = R.path(['auth', 'currentPhone']);
const getVerifyError = R.path(['auth', 'verifyError']);

const getVerifyLabel = R.cond([
  [R.equals('PHONE_CODE_INVALID'), R.always('Invalid code')],
  [R.T, R.identity]
]);

const isValidValue = R.pipe(
  R.prop('length'),
  R.lte(5),
)

export default class FormConfirm extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const input = $('ui-input', node);
    const icon = $('ui-icon', node);

    const state$ = getState$();

    const phoneNumber$ = state$
      .pipe(map(getPhoneNumber))

    phoneNumber$
      .subscribe(phoneNumber => {
        this.innerText = phoneNumber;
      });

    const verifyCodeError$ = state$
      .pipe(map(getVerifyError))
      .pipe(distinctUntilChanged())
      .pipe(map(getVerifyLabel))
    verifyCodeError$
      .subscribe((error) => {
        input.error = error || null;
        if (error) {
          wipe(input);
        }
      });

    const input$ = fromEvent(input, 'input')
    input$
      .pipe(mapTo(input))
      .pipe(map(R.prop('value')))
      .pipe(filter(isValidValue))
      .subscribe(sendVerifyCode);

    const changePhone$ = fromEvent(icon, 'click')
    changePhone$.subscribe(goToLogin);

    return this;
  }
}

Component.init(FormConfirm, component, {attributes, properties});

/** */
  function wipe(input) {
    input.disabled = false;
    input.value = '';
  }
