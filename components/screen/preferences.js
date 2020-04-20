import Component, {html, css} from '../../script/ui/Component.js';
import locator from '../../script/app/locator.js';

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

/** {ScreenPreferences} @class
  * @description Отображение экрана настроек профиля
  */
  export default class ScreenPreferences extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <app-avatar></app-avatar>

        <ui-input id="name">Name</ui-input>
        <ui-input id="last-name">Last Name</ui-input>
        <ui-input id="bio">Bio (optional)</ui-input>
        <p>Any details such as age, occupation or city. Example: 23 y.o. designer from San Francisco.</p>

        <ui-fieldset name="Username">
          <ui-input id="user-name">Username (optional)</ui-input>
          <p>You can choose a username on Telegram.
            If you do, other people will be able to find you by this username and contact you without knowing your phone number.</p>
          <p>You can use a-z, 0-9 and underscores. Minimum length is 5 characters.</p>
        </ui-fieldset>
        <ui-fab>check</ui-fab>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenPreferences} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);

      locator.channel.send('header.main', {options: { // переключаем шапку
        caption: 'Edit Profile',
        back: true
      }});

      init(node);
      return this;
    }
  }

Component.init(ScreenPreferences, 'screen-preferences', {attributes, properties});

/** */
  async function init(node) {
    const button   = node.querySelector('ui-fab');
    const name     = node.querySelector('#name');
    const lastName = node.querySelector('#last-name');
    const bio      = node.querySelector('#bio');
    const userName = node.querySelector('#user-name');

    const account  = await locator.telegram.method('users.getFullUser', {id: {_: 'inputUserSelf'}});
    name.value     = account.user.first_name || '';
    lastName.value = account.user.last_name || '';
    bio.value      = account.about || '';
    userName.value = account.user.username || '';

    button.addEventListener('click', async () => {
      const data = {
        first_name: name.value || '',
        last_name:  lastName.value || '',
        about:      bio.value || ''
      };

      const updateProfile = await locator.telegram.method('account.updateProfile', data);
      console.log('updateProfile', updateProfile);
    });
  }
