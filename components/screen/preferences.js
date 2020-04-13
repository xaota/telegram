import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import UIIcon     from '../ui/icon.js';
import UIRadio    from '../ui/radio.js';
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

  ui-checkbox, ui-radio {
    margin-bottom: 32px;
  }`;

const attributes = {};
const properties = {};

/** {ScreenPreferences} @class
  * @description Отображение экрана основных настроек
  */
  export default class ScreenPreferences extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-fieldset name="Settings">
          <div>
            <ui-icon>photo</ui-icon>
            Chat Background
          </div>
          <ui-checkbox>Enable Animations</ui-checkbox>
        </ui-fieldset>

        <ui-fieldset name="Keyboard">
          <ui-radio hint="New line by Shift + Enter" checked>Send by Enter</ui-radio>
          <ui-radio hint="New line by Enter">Send by Ctrl + Enter</ui-radio>
        </ui-fieldset>

        <ui-fieldset name="Auto-Download Media">
          <ui-checkbox>Contacts</ui-checkbox>
          <ui-checkbox>Private Chats</ui-checkbox>
          <ui-checkbox>Group Chats</ui-checkbox>
          <ui-checkbox>Channels</ui-checkbox>
        </ui-fieldset>

        <ui-fieldset name="Auto-Play Media">
          <ui-checkbox>GIFs</ui-checkbox>
          <ui-checkbox>Videos</ui-checkbox>
        </ui-fieldset>

        <ui-fieldset name="Stickers">
          <ui-checkbox>Suggest Sticker by Emoji</ui-checkbox>
          <ui-checkbox>Loop Animated Stickers</ui-checkbox>
        </ui-fieldset>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenPreferences} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(ScreenPreferences, 'screen-preferences', {attributes, properties});
