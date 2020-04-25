import Component, {html, css} from '../../script/ui/Component.js';
import Router from '../../script/ui/Router.js';

/* eslint-disable */
import ScreenLogin    from '../screen/login.js';
import ScreenConfirm  from '../screen/confirm.js';
import ScreenRegister from '../screen/register.js';
import ScreenPassword from '../screen/password.js';
/* eslint-enable */

const {map, distinctUntilChanged} = rxjs.operators;

const style = css`
  :host {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* width: 360px; */
    bottom: 0;
    justify-content: center;
    text-align: center;
    padding-top: 108px;
    flex-direction: column;
    /* margin: 0 auto; */
  }`;

const attributes = {};
const properties = {};

/** {LayoutLogin} @class
  * @description Отображение блока простого текста
  */
  export default class LayoutLogin extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <main>
          <screen-login></screen-login>
          <!--
            <screen-confirm></screen-confirm>
            <screen-register></screen-register>
            <screen-password></screen-password>
          -->
        </main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutLogin} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const router = routing(node.querySelector('main'));

      const page$ = getState$().pipe(
        map(R.propOr('loading', 'page')),
        distinctUntilChanged()
      );

      page$.subscribe(openedPage => {
        console.log('Opened page:', openedPage);
        if (openedPage === 'login') {
          router.check('screen-login');
        }

        if (openedPage === 'verify') {
          router.check('screen-confirm');
        }

        if (openedPage === 'password') {
          router.check('screen-password');
        }

        if (openedPage === 'sign-up') {
          router.check('screen-register');
        }
    });
      return this;
    }
  }

Component.init(LayoutLogin, 'layout-login', {attributes, properties});

// #region [Private]
/** */
  function routing(root) {
    return new Router(root)
      .route({
        name: 'screen-login',
        default: true
      })
      .route({
        name: 'screen-confirm',
        check: Router.nameCheck,
        handler: Router.constructorHandler(ScreenConfirm)
      })
      .route({
        name: 'screen-register',
        check: Router.nameCheck,
        handler: Router.constructorHandler(ScreenRegister)
      })
      .route({
        name: 'screen-password',
        check: Router.nameCheck,
        handler: Router.constructorHandler(ScreenPassword)
      });
  }
// #endregion
