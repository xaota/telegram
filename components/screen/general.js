import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UIFAB      from '../ui/fab.js';
import UIInput    from '../ui/input.js';
import UIFieldset from '../ui/fieldset.js';
import AppAvatar  from '../app/avatar.js';
/* eslint-enable */

const style = css`
  :host {
    /*
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative; */
  }

  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    padding: 0px 18px;
  }

  app-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto 34px;
  }

  p {
    font-size: 14px;
    color: rgb(112, 117, 121);
  }`;

const attributes = {};
const properties = {};

/** {ScreenGeneral} @class
  * @description Отображение экрана настроек профиля
  */
  export default class ScreenGeneral extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-avatar></app-avatar>

        <ui-input>Name</ui-input>
        <ui-input>Last Name</ui-input>
        <ui-input>Bio (optional)</ui-input>
        <p>Any details such as age, occupation or city. Example: 23 y.o. designer from San Francisco.</p>

        <ui-fieldset name="Username">
          <ui-input>Username (optional)</ui-input>
          <p>You can choose a username on Telegram.
            If you do, other people will be able to find you by this username and contact you without knowing your phone number.</p>
          <p>You can use a-z, 0-9 and underscores. Minimum length is 5 characters.</p>
        </ui-fieldset>
        <ui-fab>check</ui-fab>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenGeneral} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenGeneral, 'screen-general', {attributes, properties});
