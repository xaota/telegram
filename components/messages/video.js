import Component, {html, css} from '../../script/ui/Component.js';
import $, {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';
import {createUrl, downloadFile$, getTimestamp} from '../../script/helpers.js';
import {setMessageSplashScreen} from '../../state/ui/index.js';
import {buildThumbnailFileLocation, getThumbObjectFromMessage} from '../../script/utils/message.js';

/* eslint-disable */
import UIIcon from '../ui/icon.js'
/* eslint-enable */

const {of, fromEvent} = rxjs;
const {map, switchMap} = rxjs.operators;

const style = css`
  :host {
    display: block;
    position: relative;
  }

  .video {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .play-icon-place {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
  }
  
  .play-icon-place ui-icon {
    fill: #fff;
    color: #fff;
  }
  
  .play-icon-place:hover ui-icon {
    color: var(--iconHover);
    fill: var(--iconHover);
  }
  
  img {
    height: 100%;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .img {
    width: 100%;
    min-width: 200px;
  }
  .solo img {
    border-radius: 5px;
  }
  :host {
    display: block;
    font-size: 14px;
    --color: var(--foreground-label);
  }

  :host([reply]) {
    font-size: 13px;
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--field);
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
    max-width: 40rem;
    text-align: left;
    padding: 0;
    /*padding: 8px 6px;*/
    word-break: break-word;
  }

  .solo {
    flex-direction: row;
  }
  :host([left]) .main {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    background: var(--background-message-in);
  }

  :host([right]) .main {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    background: var(--background-message-out);
  }

  :host([timestamp]) slot[name="content"]::slotted(span):after {
    content: "";
    display: inline-block;
    width: 1.8rem;
  }

  .timestamp { /* timestamp */
    position: absolute;
    /* display: block;
    text-align: right; */
    font-size: 0.73333rem;
    color: #a3adb6;
    font-weight: 400;
    right: 4px;
    bottom: 1px;
  }

  :host([reply]) span {
    display: none;
  }`;

const attributes = {
  color(root, value) { cssVariable(this, 'color', value); },
  timestamp(root, value) { updateChildrenText(root, 'span#time', value); }
  // status=received, sended
  // views
  // sign (author)
};
const properties = {
  // edited
};
/** {MessageVideo} @class
 * @description Отображение сообщения-фотографии
 * @property {string} угу
 */
export default class MessageVideo extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="main">
        <div class="video">
          <div class="play-icon-place">
            <ui-icon id="play">play</ui-icon>
          </div>
        </div>
        <div class="content">
        </div>
      </div>
      <span id="time" class="timestamp"></span> <!-- timestamp -->
    </template>`;

  /** Создание компонента {MessagePhoto} @constructor
   * @param {object?} message сообщение
   */
  constructor(message) {
    super();
    this.store({message});
  }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
   * @param {ShadowRoot} node корневой узел элемента
   * @return {Component} @this {MessagePhoto} текущий компонент
   */
  mount(node) {
    super.mount(node, attributes, properties);
    const {message} = this.store();

    if (!message) return this; // !
    const divNode = $('.video', node);

    const thumbInfo = getThumbObjectFromMessage(message);
    divNode.style.height = `${thumbInfo.h}px`;
    divNode.style.width = `${thumbInfo.w}px`;

    const thumbNail$ = of(message).pipe(
      map(buildThumbnailFileLocation),
      switchMap(downloadFile$),
      map(createUrl)
    );
    thumbNail$.subscribe(thumbUrl => {
      divNode.style.backgroundImage = `url(${thumbUrl})`;
    });

    const imageClick$ = fromEvent(divNode, 'click');
    imageClick$.subscribe(() => {
      setMessageSplashScreen(message);
    });

    const contentNode = $('.content', node);
    contentNode.innerText = message.message;

    const timestamp = getTimestamp(message.date);
    const timestampNode = $('.timestamp', node);
    timestampNode.innerText = timestamp;

    return this;
  }
}

Component.init(MessageVideo, 'message-video', {attributes, properties});
