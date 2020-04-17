import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon from '../ui/icon.js';
/* eslint-enable */

const style = css`
  :host {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  }

  h1 {
    color: rgb(112, 117, 121);
    font-size: 24px;
    width: 200px;
    text-align: center;
    line-height: 32px;
    font-weight: normal;
  }

  main {
    display: flex;
    width: 400px;
    align-items: flex-start;
    justify-content: space-between;
  }

  ui-icon {
    color: #C5C9CC;
  }

  :host > ui-icon {
    width: 144px;
    height: 144px;
  }

  div {
    text-align: center;
  }

  div > ui-icon {
    display: flex;
    border-radius: 100%;
    background: var(--background-field);
    width: 36px;
    height: 36px;
    padding: 18px;
    margin-bottom: 8px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  div > span {
    display: block;
    color: rgb(112, 117, 121);
  }

  div:hover > ui-icon {
    background-color: #63A4F0;
    color: #fff;
  }

  div:hover > span {
    color: #63A4F0;
  }`;

const attributes = {};
const properties = {};

/** {ScreenEmpty} @class
  * @description Отображение пустого раздела общения
  */
  export default class ScreenEmpty extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <ui-icon>conversation</ui-icon>
        <h1>Open Chat or create a new one</h1>
        <main>
          <div>
            <ui-icon>private</ui-icon>
            <span>Private</span>
          </div>
          <div id="group">
            <ui-icon>group</ui-icon>
            <span>Group</span>
          </div>
          <div id="channel">
            <ui-icon>channel</ui-icon>
            <span>Channel</span>
          </div>
        </main>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenEmpty} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const newGroup   = $('#group ui-icon', node);
      const newChannel = $('#channel ui-icon', node);
      // newGroup  .addEventListener('click', _ => channel.send('route-aside', {route: 'form-group'}));
      // newChannel.addEventListener('click', _ => channel.send('route-aside', {route: 'form-channel'}));
      return this;
    }
  }

Component.init(ScreenEmpty, 'screen-empty', {attributes, properties});
