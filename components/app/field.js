import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {tabsSelector} from '../../script/ui/tabSelector.js';
import {attachOverlay} from '../ui/overlay.js';
import {getActiveDialogInputPeer$} from '../../state/dialogs/stream-builders.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {sendMessage} from '../../state/dialogs/actions.js';

/* eslint-disable */
import UIDrop from '../ui/drop.js';
import UIMenu from '../ui/menu.js';
import UIItem from '../ui/item.js';
import UIIcon from '../ui/icon.js';
import UIInput from '../ui/input.js';
import UIButton from '../ui/button.js';
import UITabs from '../ui/tabs.js';
import UITab from '../ui/tab.js';
import ModalSendFile from './modal-send-file.js';
import EmojiPicker from './emoji-picker.js';
import StickerPicker from './sticker-picker.js';
/* eslint-enable */

const {fromEvent, merge} = rxjs;
const {filter, map, tap, withLatestFrom} = rxjs.operators;

const {construct} = zagram;

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
  
  .emoji-drop {
    width: 320px;
    height: 320px;
    display: flex;
    flex-direction: column;
  }
  
  .tab-content {
    display: flex;
    flex-direction: columns;
    height: 0;
    flex-grow: 1;
    width: 100%;
    overflow-y: auto;
  }
  
  emoji-picker {
    display: none;
  }
  
  sticker-picker {
    display: none;
    height: 100%;
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
              <div class="emoji-drop" slot="drop">
                <ui-tabs>
                  <ui-tab id="emoji-tab" selected>Emoji</ui-tab>
                  <ui-tab id="stickers-tab">Stickers</ui-tab>
                  <ui-tab id="gifs-tab">GIFs</ui-tab>
                </ui-tabs>
                <div class="tab-content">
                    <emoji-picker></emoji-picker>
                    <sticker-picker></sticker-picker>
                </div>
              </div>
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

      const documentNode = $('#document', node);
      const documentClick$ = fromEvent(documentNode, 'click');
      const mediaDocumentNode = $('#mediaDocument', node);
      documentClick$.subscribe(() => {
        mediaDocumentNode.click();
      });

      const mediaFileChanged$ = fromEvent(mediaFileNode, 'change')
        .pipe(map(() => mediaFileNode.files[0]));
      const mediaDocumentChanged$ = fromEvent(mediaDocumentNode, 'change')
        .pipe(map(() => mediaDocumentNode.files[0]));

      const mediaFile$ = merge(mediaFileChanged$, mediaDocumentChanged$);

      mediaFile$.subscribe(file => {
        attachOverlay(node, ModalSendFile, file);
        mediaFileNode.value = null;
        mediaDocumentNode.value = null;
      });

      const emojiDropNode = $('.emoji-drop', node);
      emojiDropNode.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
      });

      const uiTabsNode = $('ui-tabs', node);
      const uiTabContentNode = $('.tab-content', node);
      const emojiPickerNode = $('emoji-picker', node);
      const stickerPickerNode = $('sticker-picker', node);
      tabsSelector(
        uiTabsNode,
        ['#emoji-tab', '#stickers-tab', '#gifs-tab'],
        '#emoji-tab'
      )
        .subscribe(x => {
          emojiPickerNode.style.display = 'none';
          stickerPickerNode.style.display = 'none';
          if (x === '#emoji-tab') {
            emojiPickerNode.style.display = 'flex';
          } else {
            stickerPickerNode.style.display = 'flex';
          }
        });

      const emoji$ = fromEvent(emojiPickerNode, 'emoji-selected');
      emoji$.subscribe(event => {
        const {detail: emojiItem} = event;
        textareaNode.value += emojiItem.emoji;
      });

      const state$ = getState$();
      const activeInputPeer$ = getActiveDialogInputPeer$(state$);
      const sticker$ = fromEvent(stickerPickerNode, 'sticker-selected')
        .pipe(map(R.prop('detail')));

      const submit$ = sticker$.pipe(
        map(R.partial(construct, ['inputDocument'])),
        map(wrapAsObjWithKey('media')),
        withLatestFrom(activeInputPeer$.pipe(map(wrapAsObjWithKey('peer')))),
        map(R.mergeAll),
        map(R.merge({message: ''}))
      );

      submit$.subscribe(sendMessage);

      return this;
    }
  }

Component.init(AppField, 'app-field', {attributes, properties});

// #region [Private]

// #endregion
