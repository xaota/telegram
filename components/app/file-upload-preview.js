import Component, {html, css} from "../../script/ui/Component.js";
import $ from '../../script/ui/DOM.js';
import {humanFileSize} from '../../script/utils/message.js';


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
export default class FileUploadPreview extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="icon-place">
        <div class="icon-download">
          <ui-icon id="document">document</ui-icon>
        </div>
      </div>
      <div class="info-place">
        <div class="name-place"></div>
        <div class="sub-info-place">
          <span class="size-info"></span>
          <span class="sub-info"></span>
        </div>
      </div>
    </template>
  `;

  constructor(file) {
    super();
    this.file = file;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const namePlaceNode = $('.name-place', node);
    namePlaceNode.innerText = this.file.name;

    const sizePlaceNode = $('.size-info', node);
    sizePlaceNode.innerText = humanFileSize(this.file.size);
    return this;
  }
}

Component.init(FileUploadPreview, 'file-upload-preview', {attributes, properties});
