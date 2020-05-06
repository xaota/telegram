import Component, {html, css} from "../../script/ui/Component.js";
import $ from '../../script/ui/DOM.js';
import {downloadFile$, createUrl} from '../../script/helpers.js';
import {
  buildInputDocumentFileLocation,
  getFileSize,
  getFilename,
  getReadableFileSize
} from '../../script/utils/message.js';

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
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    height: 64px;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    overflow: hidden;
  }
  
  :host(:hover) {
    background-color: var(--background-aside-hover);
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

const attributes = {};

const properties = {};

export default class DocumentPreview extends  Component {
  static template = html`
    <template>
      <style>${style}</style>
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
    </template>
  `;

  constructor(message) {
    super();
    this.store({message});
  }

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

    return this;
  }
}

Component.init(DocumentPreview, 'document-preview', {attributes, properties});
