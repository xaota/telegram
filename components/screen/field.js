import Component, {html, css} from '../../script/ui/Component.js';
// import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon   from '../ui/icon.js';
import AppField from '../app/field.js';
/* eslint-enable */

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  :host([hidden]) {
    display: none;
  }

  .wrap {
    width: 100%;
    max-width: 720px;
    font-size: 16px;
    box-sizing: border-box;
    padding: calc(.4rem - 1px) 1.33333rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .wra2 {
    position: relative;
    flex: 1 50%
  }

  .wra2:after,.wra2:before {
    position: absolute;
    width: 12px;
    right: 0;
    transform: translateX(calc(100% - 2px));
    bottom: 0;
    content: "";
  }

  .wra2:before { /* тень хвостика (только вниз пусть будет) */
    height: 1px; /* 0 */
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
  }

  .wra2:after {
    height: 24px;
    background: radial-gradient(ellipse farthest-side at top right, transparent 100%, var(--field) 100%);
  }

  .action {
    background: var(--field);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 50%;
    width: 3.6rem;
    height: 3.6rem;
    box-shadow: 0 1px 2px 0 rgba(16,35,47,.15);
    margin-left: .53333rem;
  }
  .action:hover ui-icon {
    color: var(--iconHover)
  }`;

const attributes = {};
const properties = {};

/** {ScreenField} @class
  * @description Отображение экрана ввода сообщения
  */
  export default class ScreenField extends Component {
    static template = html`
      <template>
        <style>${style}</style>

        <div class="wrap">
          <div class="wra2">
            <slot></slot>
            <app-field></app-field>
          </div>
          <div class="action">
            <ui-icon>micro-2</ui-icon>
          </div>
        </div>

      </template>`;

  // /** Создание компонента {ScreenField} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {ScreenField} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      return this;
    }
  }

Component.init(ScreenField, 'screen-field', {attributes, properties});

// #region [Private]

// #endregion
