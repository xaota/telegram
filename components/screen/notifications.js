import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UICheckbox from '../ui/checkbox.js';
import UIFieldset from '../ui/fieldset.js';
/* eslint-enable */

const style = css`
  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    padding: 0px 18px;
  }

  ui-checkbox {
    margin-bottom: 32px;
  }`;

const attributes = {};
const properties = {};

/** {ScreenNotifications} @class
  * @description Отображение экрана основных настроек
  */
  export default class ScreenNotifications extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-fieldset name="Private Chats">
          <ui-checkbox checked hint>Notifications for private chats</ui-checkbox>
          <ui-checkbox checked hint>Message preview</ui-checkbox>
        </ui-fieldset>

        <ui-fieldset name="Groups">
          <ui-checkbox checked hint>Notifications for groups</ui-checkbox>
          <ui-checkbox checked hint>Message preview</ui-checkbox>
        </ui-fieldset>

        <ui-fieldset name="Channels">
          <ui-checkbox checked hint>Notifications for channels</ui-checkbox>
          <ui-checkbox checked hint>Message preview</ui-checkbox>
        </ui-fieldset>

        <ui-fieldset name="Other">
          <ui-checkbox hint>Contacts joined Telegram</ui-checkbox>
        </ui-fieldset>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenNotifications} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenNotifications, 'screen-notifications', {attributes, properties});
