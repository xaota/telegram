import Component, {html, css} from '../../script/ui/Component.js';
import $, {cssVariable, updateChildrenText} from '../../script/ui/DOM.js';
import {
  buildInputDocumentFileLocation,
  getFilename, getFileSize,
  getReadableFileSize
} from '../../script/utils/message.js';
import {downloadFile$, getTimestamp, createUrl} from '../../script/helpers.js';

/* eslint-disable */
import UIIcon     from '../ui/icon.js';
/* eslint-enable */


const {fromEvent} = rxjs;
const {mapTo, map, switchMap, tap} = rxjs.operators;

function trackProgress(node, downloadedPartsCount, totalPartsCount) {
  const percent = (downloadedPartsCount/totalPartsCount) * 100;
  node.innerText = `${(percent).toFixed(2)}%`;
}

function setDownloaded(node) {
  node.innerText = 'Downloaded';
}

function setCanceled(node) {
  node.innerText = 'Canceled';
}

function showDownload(node) {
  const downloadNode = $('.icon-download', node);
  downloadNode.style.display = 'flex';

  const cancelNode = $('.icon-cancel', node);
  cancelNode.style.display = 'none';

  const completedNode = $('.icon-completed', node);
  completedNode.style.display = 'none';
}

function showCancel(node) {
  const downloadNode = $('.icon-download', node);
  downloadNode.style.display = 'none';

  const cancelNode = $('.icon-cancel', node);
  cancelNode.style.display = 'flex';

  const completedNode = $('.icon-completed', node);
  completedNode.style.display = 'none';
}

function showCompleted(node) {
  const downloadNode = $('.icon-download', node);
  downloadNode.style.display = 'none';

  const cancelNode = $('.icon-cancel', node);
  cancelNode.style.display = 'none';

  const completedNode = $('.icon-completed', node);
  completedNode.style.display = 'flex';
}

/**
 * @param {File} file
 */
function saveDownloadedFile(filename, file) {
  const fileUrl = createUrl(file);
  const element = document.createElement('a');
  element.setAttribute('href', fileUrl);
  element.setAttribute('download', filename);

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const style = css`
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
    flex-direction: row;
    align-items: center;
    background: var(--field);
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
    max-width: 40rem;
    text-align: left;
    padding: 8px 6px;
    word-break: break-word;
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

  /* хвостик */
  :host([left]:last-child) .main {
    border-bottom-left-radius: 0;
  }

  :host([right]:last-child) .main {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 5px;
  }

  :host([left]:last-child) .main::after, :host([left]:last-child) .main::before,
  :host([right]:last-child) .main::after, :host([right]:last-child) .main::before {
    position: absolute;
    width: 12px;
    left: 0;
    transform: translateX(calc(-100% + 2px));
    bottom: 0;
    content: "";
  }

  :host([left]:last-child) .main::before,
  :host([right]:last-child) .main::before { /* тень хвостика (только вниз пусть будет) */
    height: 1px; /* 0 */
    box-shadow: 0 1px 2px 0 rgba(16, 35, 47, 0.15);
  }

  :host([left]:last-child) .main::after,
  :host([right]:last-child) .main::after { /* хвостик */
    height: 24px;
    background: radial-gradient(ellipse farthest-side at top left, transparent 100%, var(--background-message-in) 100%);
  }

  :host([right]:last-child) .main::before,
  :host([right]:last-child) .main::after {
    right: 0;
    transform: translateX(calc(100% - 2px));
    left: inherit;
  }

  :host([right]:last-child) .main::after {
    background: radial-gradient(ellipse farthest-side at top right, transparent 100%, var(--background-message-out) 100%);
  }

  :host([reply]) .main::before,
  :host([reply]) .main::after {
    display: none;
  }

  /* ----------------- */

  :host([reply]) div {
    border-left: 2px solid #4ea4f5;
    border-radius: 0;
    box-shadow: none;
    display: block;
    max-width: 100%;
    background: transparent;
    padding-left: 3px;
    position: static;
  }

  slot {
    display: block;
    font-size: 1rem;
    padding: 0 5px;
  }

  slot[name="author"] {
    display: block;
  }

  slot[name="author"]::slotted(span) {
    font-size: 0.93333rem;
    margin-bottom: 2px;
    font-weight: 600;
    line-height: 150%;
    color: var(--color);
  }

  slot[name="content"] {
    /* white-space: pre-wrap; */
  }

  :host([reply]) slot[name="content"]::slotted(span) {
    color: #707579;
  }

  :host([timestamp]) slot[name="content"]::slotted(span):after {
    content: "";
    display: inline-block;
    width: 1.8rem;
  }

  .timestamp { 
    position: absolute;
    /* display: block;
    text-align: right; */
    font-size: 0.73333rem;
    color: #a3adb6;
    font-weight: 400;
    right: 6px;
    bottom: 5px;
  }

  :host([reply]) span {
    display: none;
  }

  ui-file {
    padding-right: 3px;
    padding-left: 3px;
  }
  
  .icon-place {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    background-color: #4092E4;
    margin-left: 8px;
    margin-right: 8px;
  }
  
  ui-icon {
    color: #fff;
  }
  
  .info-place {
    
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: calc(100% - 72px);
  }
  
  .icon-download {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    background-color: #4092E4;
    cursor: pointer;
  }
  
  .icon-cancel {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    background-color: #4092E4;
    cursor: pointer;
  }
  
  .icon-cancel:hover {
    background-color: #f6553b;
  }
  
  .icon-completed {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
    background-color: #4092E4;
  }
  
  .name-place {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .sub-info-place {
    color: var(--grayTextColor);
    font-size: 14px;
    display: flex;
    flex-direction: row;
  }
  .size-info {
    margin-right: 8px;
  }
  
  `;

const attributes = {
  color(root, value) { cssVariable(this, 'color', value); },
  timestamp(root, value) { updateChildrenText(root, 'span', value); }
  // status=received, sended
  // views
  // sign (author)
};
const properties = {
  // edited
};

/** {MessageDocument} @class
  * @description Отображение сообщения c вложением
  */
  export default class MessageDocument extends Component {
    static template = html`
      <template>
        <style>${style}</style>

        <div class="main">
      <div class="icon-place">
        <div class="icon-download">
            <ui-icon id="download">download</ui-icon>
        </div>
        <div class="icon-cancel">
            <ui-icon id="cancel">close</ui-icon>
        </div>
        <div class="icon-completed">
            <ui-icon id="cancel">check</ui-icon>
        </div>
      </div>
      <div class="info-place">
        <div class="name-place">Some file name</div>
        <div class="sub-info-place">
            <span class="size-info"></span>
            <span class="sub-info"></span>
        </div>
      </div>
        <span class="timestamp"></span>
        </div>
      </template>`;

  /** Создание компонента {MessageDocument} @constructor
    * @param {*} data содержимое элемента
    * @param {string?} time временная метка сообщения
    */
    constructor(message) {
      super();
      this.store({message});
    }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {MessageDocument} текущий компонент
    */
    mount(node) {
      super.mount(node, attributes, properties);
      const {message} = this.store();

    const filename = getFilename(message);
    const namePlaceNode = $('.name-place', node);
    namePlaceNode.innerText = filename;

    const fileSize = getReadableFileSize(message);
    const sizeInfoNode = $('.size-info', node);
    sizeInfoNode.innerText = fileSize;

    const subInfoNode = $('.sub-info', node);

    let cancelDownloading = R.identity;

    const iconPlaceNode = $('.icon-download', node);
    const downloadClick$ = fromEvent(iconPlaceNode, 'click');

    const download$ =  downloadClick$.pipe(
      mapTo(message),
      map(buildInputDocumentFileLocation),
      map(fileLocation => [
        fileLocation,
        {progressCb: R.partial(trackProgress, [subInfoNode]), size: getFileSize(message)},
        true
      ]),
      map(R.apply(downloadFile$)),
      tap(([promise$, cancel]) => {
        cancelDownloading = cancel;
        showCancel(node);
      }),
      switchMap(R.nth(0)),
      tap(R.partial(saveDownloadedFile, [filename]))
    );

    download$.subscribe(
      () => {
        setDownloaded(subInfoNode);
        showCompleted(node);
      },
      x => {
        console.warn(x);
        setCanceled(subInfoNode);
        showDownload(node);
      }
    );

    const cancelNode = $('.icon-cancel', node);
    const cancel$ = fromEvent(cancelNode, 'click');
    cancel$.subscribe(() => {
      cancelDownloading();
      setCanceled(subInfoNode);
      showDownload(node);
    });

    const timestamp = getTimestamp(message.date);
    const timestampNode = $('.timestamp', node);
    timestampNode.innerText = timestamp;

    return this;
  }

  /**
   *
   * @param {*} data
   * @param {string} time
   */
    static from(data, time) {
      const content = new MessageDocument(data, time);
      return content;
    }
  }

Component.init(MessageDocument, 'message-document', {attributes, properties});
