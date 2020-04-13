import Component, {html, css} from "../../script/ui/Component.js";
import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIIcon from '../ui/icon.js';
/* eslint-enable */

const style = css`
  .enter-avatar {
    position: relative;
    background: #4ea4f6;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
    width: 160px;
    height: 160px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
    cursor: pointer;
    --iconHover: #fff;
    --iconStatic: #fff;
  }

  ui-icon#photo-add {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0.3);
  }

  #resultCanvas {
    border-radius: 50%;
  }

  #overlay {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(2, 30, 60, 0.38);
    z-index: 100;
  }

  #editPhotoPopup {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 35vw;
    background-color: #fff;
    border-radius: 8px;
  }

  .editPhotoHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 48px;
  }

  .editPhotoBody {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    padding-left: 48px;
    padding-right: 48px;
  }

  .editPhotoBottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: 48px;
  }

  .btn-circle {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .btn-primary {
    --iconHover: #fff;
    --iconStatic: #fff;
    color: #fff;
    background: #4ea4f6;
  }

  .closeButtonWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }

  .btn {
    cursor: pointer;
  }

  .photoCanvas {
    position: absolute;
    top: 0;
    left: 0;
    clip-path: circle(80px at 80px 80px);
    flex-grow: 1;
  }

  .photoCanvasBackground {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.3;
  }

  #editPhotoImg {
    position: relative;
  }`;

const attributes = {};
const properties = {};

/** {AppAvatar} @class
  * @description Отображение экрана входа
  */
  export default class AppAvatar extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <label for="enterName_fileInput">
          <input id="enterName_fileInput" type="file" accept="image/*" style="display: none">
          <div class="enter-avatar">
            <ui-icon id="photo-add">photo-add</ui-icon>
            <canvas id="resultCanvas" width="160" height="160"></canvas>
          </div>
          </label>
          <div id="overlay" style="display: none">
            <div id="editPhotoPopup">
              <div class="editPhotoHeader">
                <div class="closeButtonWrapper">
                  <a id="editPhoto_closeButton" class="btn"><ui-icon>close</ui-icon></a>
                </div>
                <div class="editPhoto_title">Drag to Reposition</div>
              </div>
              <div class="editPhotoBody">
                <div id="editPhotoImg">
                  <canvas width="300" class="photoCanvasBackground"></canvas>
                  <canvas width="300" class="photoCanvas"></canvas>
                </div>
              </div>
              <div class="editPhotoBottom">
                <a id="editPhoto_okButton" class="btn btn-primary btn-circle">
                  <ui-icon>check</ui-icon>
                </a>
              </div>
            </div>
          </div>
      </template>`;

  // /** Создание компонента {AppAvatar} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {HTMLElement} node корневой узел элемента
    * @return {Component} @this {AppAvatar} текущий компонент
    */
    mount(node) {
      return super.mount(node, attributes, properties);
    }
  }

Component.init(AppAvatar, 'app-avatar', {attributes, properties});
