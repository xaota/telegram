import Component from '../../../script/Component.js';
import $, {channel} from '../../../script/DOM.js';
import { buildInput$ } from '../../../script/helpers.js';
import { signUp } from '../../../state/auth/index.js';

import UIIcon    from '../../ui/icon/ui-icon.js';
import UIInput   from '../../ui/input/ui-input.js';
import UIButton  from '../../ui/button/ui-button.js';
import UISticker from '../../ui/sticker/ui-sticker.js';

const { fromEvent, combineLatest } = rxjs;
const { map, withLatestFrom, distinctUntilChanged } = rxjs.operators;

const component = Component.meta(import.meta.url, 'form-register');
const attributes = {};
const properties = {};



const buildFirstName = R.set(R.lensProp('firstName'), R.__, {});
const buildLastName = R.set(R.lensProp('lastName'), R.__, {});

const getSignUpError = R.pathOr(null, ['auth', 'signUpError']);

export default class FormRegister extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const firstName = $('#first-name', node);
    const lastName = $('#last-name', node);
    const submit = $('ui-button', node);

    const firstName$ = buildInput$(firstName).pipe(map(buildFirstName));
    const lastName$ = buildInput$(lastName).pipe(map(buildLastName));
    const info$ = combineLatest(firstName$, lastName$).pipe(map(R.mergeAll));

    const click$ = fromEvent(submit, 'click');
    const submit$ = click$.pipe(withLatestFrom(info$)).pipe(map(R.nth(1)));
    submit$.subscribe(signUp);

    const state$ = getState$();

    const signUpError$ = state$
      .pipe(map(getSignUpError))
      .pipe(distinctUntilChanged());

    const firstNameInvalid$ = signUpError$
      .pipe(map(R.equals('FIRSTNAME_INVALID')))
      .pipe(distinctUntilChanged());
    firstNameInvalid$.subscribe((invalid) => {
      firstName.error = invalid ? 'First name invalid' : null;
    });

    const lastNameInvalid$ = signUpError$
      .pipe(map(R.equals('LASTNAME_INVALID')))
      .pipe(distinctUntilChanged());
    lastNameInvalid$.subscribe((invalid) => {
      lastName.error = invalid ? 'Last name invalid' : null;
    })

    return this;
  }
}

Component.init(FormRegister, component, {attributes, properties});
