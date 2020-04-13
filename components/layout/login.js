import Component, {html, css} from '../../script/ui/Component.js';
import Router from '../../script/ui/Router.js';

import locator from '../../script/app/locator.js';

/* eslint-disable */
import ScreenLogin    from '../screen/login.js';
import ScreenConfirm  from '../screen/confirm.js';
import ScreenRegister from '../screen/register.js';
import ScreenPassword from '../screen/password.js';
/* eslint-enable */

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
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {LayoutLogin} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const router = routing(node.querySelector('main'));

      locator.channel.on('$.auth.confirm', details => router.check('screen-confirm', details));
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
        check: (route, location) => location === route.name
      })
      .route({
        name: 'screen-password',
        check: (route, location) => location === route.name
      });
  }
// #endregion
