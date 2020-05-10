import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

/* eslint-disable */
import UIDrop from '../ui/drop.js';
import UIMenu from '../ui/menu.js';
import UIItem from '../ui/item.js';
import UIIcon from '../ui/icon.js';
import UIInput from '../ui/input.js';
import UIButton from '../ui/button.js';
import {attachOverlay} from '../ui/overlay.js'
import ModalSendPhoto from './modal-send-photo.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {filter, map, tap} = rxjs.operators;

const style = css`
  .inp {
    background: var(--field);
    border-radius: .66667rem;
    border-bottom-right-radius: 0;
    box-shadow: 0 1px 2px 0 rgba(16,35,47,.15);
    /* width: 100%; */
    z-index: 1;
    padding: .53333rem 1.06667rem;
    outline: none;
    position: relative;
    box-sizing: border-box;
  }

  .msg_block {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .reply {
    display: flex;
    align-items: center;
  }

  .wrap_textarea {
    padding: 10px 0;
    flex-grow: 1;
  }

  textarea {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    font-size: 1.06667rem;
    background: none;
    color: var(--foreground);
    width: 100%;
    padding: 0;
    line-height: 20px;
    resize: none;
  }

  textarea:focus {
    border: none;
    outline-offset: 0;
    outline: none;
  }

  #close, #emoji, #attach {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 44px;
    margin-right: 16px;
  }
  #close {
    cursor: pointer;
    margin-right: 17px;
  }
  #attach {
    margin-right: 0px;
  }
  #attach:hover {
    cursor: pointer;
  }

  .attach-list {
    display: flex;
    flex-direction: column;
    padding: 26px 18px;
  }
  .attach-list ui-icon {
    padding-right: 35px;
  }
  .attach-list ui-icon:hover {
    color: var(--iconStatic);
  }
  .attach-list div {
    display: flex;
    align-items: center;
  }
  .attach-list div:hover {
    cursor: pointer;
  }
  .attach-list div + div {
    padding-top: 20px;
  }

  .web {
    padding-left: 1px;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
  }

  .web img {
    padding-bottom: 5px;
    width: 50%;
  }

  .web .name {
    color: #539CE6;
    font-weight: 500;
    padding-bottom: 5px;
  }
  .web .title {
    font-weight: 600;
    padding-bottom: 5px;
  }
  .web .descr {
    font-weight: 400;
  }

  a {
    color: #358EE3;
  }

  #url {
    cursor: pointer;
    border-left: 2px solid #4ea4f5;
    display: flex;
    margin-top: 5px;
  }
  `;

const attributes = {};
const properties = {};

/** {AppField} @class
  * @description Отображение поля ввода сообщения
  */
  export default class AppField extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <div class="inp">

          <!-- <div class="reply">
            <ui-icon id="close">close</ui-icon>
            <message-text slot="content" timestamp="10:02" color="D77F7C" reply>
              <span slot="author">Виктор Назаренко</span>
              <span slot="content">По идее может же</span>
            </message-text>
          </div> -->
          <div id="url"></div>
          <div class="msg_block">
            <ui-drop id="drop-emoji" up>
              <ui-icon id="emoji">emoji</ui-icon>
              <form-emoji slot="drop"></form-emoji>
            </ui-drop>
            <div class="wrap_textarea">
              <textarea placeholder="Message" rows="1"></textarea>
            </div>
            <input type="file" id="fileInput" style="display: none">
            <ui-drop id="drop-attach" up right>
              <ui-icon id="attach">attach</ui-icon>
              <ui-menu slot="drop">
                <ui-item icon="photo" id="photo">Photo or Video</ui-item>
                <ui-item icon="document" id="document">Document</ui-item>
                <ui-item icon="poll">Poll</ui-item>
              </ui-menu>
            </ui-drop>
          </div>
        </div>
        <input type="file" style="display: none" id="mediaFile" accept="video/*,image/*" />
        <input type="file" style="display: none" id="mediaDocument" accept="" />
      </template>`;

  // /** Создание компонента {AppField} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {AppField} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const textareaNode = $('textarea', node);

      const textareaKeyUP$ = fromEvent(textareaNode, 'keyup');
      const textareaEnterPress$ = textareaKeyUP$.pipe(filter(R.propEq('keyCode', 13)));

      const textareaValue$ = textareaEnterPress$.pipe(
        map(() => textareaNode.value),
        tap(() => {
          textareaNode.value = '';
        })
      );
      textareaValue$.subscribe(message => {
        this.event('new-message', message);
      });


      const photoNode = $('#photo', node);
      const photoClick$ = fromEvent(photoNode, 'click');
      const mediaFileNode = $('#mediaFile', node);
      photoClick$.subscribe(() => {
        mediaFileNode.click();
      });
      const mediaChanged$ = fromEvent(mediaFileNode, 'change');
      const mediaFile$ = mediaChanged$.pipe(map(() => mediaFileNode.files[0]));
      mediaFile$.subscribe(file => {
        attachOverlay(node, ModalSendPhoto, file);
      });

      return this;
    }
  }

Component.init(AppField, 'app-field', {attributes, properties});

// #region [Private]

// #endregion
