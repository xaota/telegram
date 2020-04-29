import Component, {html, css} from "../../script/ui/Component.js";
import $ from '../../script/ui/DOM.js';
import {downloadFile$, createUrl} from '../../script/helpers.js';

/* eslint-disable */
import UIIcon     from '../ui/icon.js';
/* eslint-enable */

const {fromEvent} = rxjs;
const {mapTo, map, switchMap, tap} = rxjs.operators;
const {isObjectOf, construct} = zagram;

/* eslint-disable */
function humanFileSize(bytes) {
  const thresh = 1024;
  if(Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = ['kB','MB','GB','TB','PB','EB','ZB','YB']
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1)+' '+units[u];
}
/* eslint-enable*/

/**
 * Takes document object from message
 */
const getDocument = R.path(['media', 'document']);

const getFilename = R.pipe(
  getDocument,
  R.prop('attributes'),
  R.filter(isObjectOf('documentAttributeFilename')),
  R.pathOr('file', [0, 'file_name'])
);


const getFileSize = R.pipe(
  getDocument,
  R.prop('size')
);

const getReadableFileSize = R.pipe(
  getFileSize,
  humanFileSize
);

/**
 * Takes message and returns input document file location object
 */
const buildInputDocumentFileLocation = R.pipe(
  getDocument,
  R.pick(['id', 'file_reference', 'access_hash']),
  R.merge({'thumb_size': 0}),
  R.partial(construct, ['inputDocumentFileLocation'])
);

function trackProgress(node, downloadedPartsCount, totalPartsCount) {
  const percent = (downloadedPartsCount/totalPartsCount) * 100;
  node.innerText = `${(percent).toFixed(2)}%`;
}

function setDownloaded(node) {
  node.innerText = 'Downloaded';
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
    cursor: pointer;
  }
  
  .info-place {
    
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: calc(100% - 72px);
  }
  
  .name-place {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .sub-info {
    color: var(--grayTextColor);
    font-size: 14px;
  }
`;

const attributes = {};

const properties = {};

export default class DocumentPreview extends  Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="icon-place">
        <ui-icon id="download">download</ui-icon>
      </div>
      <div class="info-place">
        <div class="name-place">Some file name</div>
        <div class="sub-info"></div>
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
    const subInfoNode = $('.sub-info', node);
    subInfoNode.innerText = fileSize;

    const iconPlaceNode = $('.icon-place', node);
    const iconPlaceClick$ = fromEvent(iconPlaceNode, 'click');

    const download$ =  iconPlaceClick$.pipe(
        mapTo(message),
        map(buildInputDocumentFileLocation),
        map(fileLocation => [
          fileLocation,
          {progressCb: R.partial(trackProgress, [subInfoNode]), size: getFileSize(message)}
        ]),
        switchMap(R.apply(downloadFile$)),
        tap(R.partial(saveDownloadedFile, [filename]))
      );

    download$.subscribe(x => {
      setDownloaded(subInfoNode);
    });

    return this;
  }
}

Component.init(DocumentPreview, 'document-preview', {attributes, properties});
