import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';
import {buildInput$} from '../../../script/helpers.js';
import {sendPassword} from '../../../state/auth/index.js';

/* eslint-disable */
import UIInput from '../../ui/input/ui-input.js';
import UIButton from '../../ui/button/ui-button.js';
import UISticker from '../../ui/sticker/ui-sticker.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {withLatestFrom, map, distinctUntilChanged} = rxjs.operators;

const component = Component.meta(import.meta.url, 'form-password');
const attributes = {};

const properties = {};

const getSendingState = R.pathOr(false, ['auth', 'passwordSending']);
const getSendingError = R.pathOr(null, ['auth', 'passwordError']);

export default class FormPassword extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const input = $('ui-input', node);
    const submit = $('ui-button', node);

    const input$ = buildInput$(input);

    const state$ = getState$();

    const sendingStatus$ = state$
      .pipe(
        map(getSendingState),
        distinctUntilChanged()
      );
    sendingStatus$.subscribe(status => {
      input.disabled = status;
      submit.loading = status;
    });

    const sendingError$ = state$
      .pipe(
        map(getSendingError),
        distinctUntilChanged()
      );

    sendingError$.subscribe(error => {
      input.error = error;
    });

    const submit$ = fromEvent(submit, 'click')
      .pipe(
        withLatestFrom(input$),
        map(R.nth(1))
      );
    submit$.subscribe(x => {
      console.log(`[send-password] ${x}`);
      sendPassword(x);
    });

    return this;
  }
}

Component.init(FormPassword, component, {attributes, properties});
