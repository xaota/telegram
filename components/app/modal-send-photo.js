import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {createUrl, wrapAsObjWithKey} from '../../script/helpers.js';
import {getActiveDialogInputPeer$} from '../../state/dialogs/stream-builders.js';
import {sendMessage} from '../../state/dialogs/actions.js';

/* eslint-disable */
import UIButton from '../ui/button.js';
import UIInput from '../ui/input.js';
import UIIcon from '../ui/icon.js';
/* eslint-enable */

const {fromEvent, merge} = rxjs;
const {map, filter, withLatestFrom} = rxjs.operators;

const style = css`
  .modal {
    width: 400px;
    border-radius: 8px;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  
  .modal-header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .icon-place {
    flex-grow: 0;
    flex-shrink: 0;
  }
  
  .header-place {
    flex-grow: 1;
  }
  
  .button-place {
    flex-grow: 0;
  }
  
  .icon-place ui-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    line-height: 44px;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 10px;
    color: var(--iconStatic);
  }
 
  .icon-place ui-icon:hover {
    background-color: var(--background-field);
    color: var(--iconStatic);
  } 
  
  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    margin-bottom: 24px;
  }
  
  .modal-body img{
    max-width: 100%;
    max-height: 500px;
    border-radius: 8px;
  }
  
  .modal-footer: {
  }
`;
const attributes = {};
const properties = {};
export default class ModalSendPhoto extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="modal">
        <div class="modal-header">
          <div class="icon-place">
            <ui-icon id="close">close</ui-icon>
          </div>
          <div class="header-place">
            Send photo/video
          </div>
          <div class="button-place">
            <ui-button id="send-button" size="small" >Send</ui-button>
          </div>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
          <ui-input id="caption">Add a caption</ui-input>
        </div>
      </div>
    </template>
  `

  constructor(fileImage) {
    super();
    this.fileImage = fileImage;
  }

  mount(node) {
    super.mount(node, attributes, properties);

    const url = createUrl(this.fileImage);
    const img = new Image();
    img.src = url;
    const modalBodyNode = $('.modal-body', node);

    modalBodyNode.appendChild(img);

    const closeIconNode = $('#close', node);
    const close$ = fromEvent(closeIconNode, 'click');
    close$.subscribe(() => {
      this.event('close-modal');
    });

    const state$ = getState$();
    const activeInputPeer$ = getActiveDialogInputPeer$(state$);

    const buttonNode = $('#send-button', node);
    console.log('Button node:', buttonNode);
    const submitClick$ = fromEvent(buttonNode, 'click');

    const captionNode = $('#caption', node);
    const submitOnEnter$ = fromEvent(captionNode, 'keyup')
      .pipe(filter(R.propEq('keyCode', 13)));

    const submitEvent$ = merge(submitClick$, submitOnEnter$);

    const submit$ = submitEvent$.pipe(
      map(() => ({
        message: captionNode.value,
        media: this.fileImage
      })),
      withLatestFrom(activeInputPeer$.pipe(map(wrapAsObjWithKey('peer')))),
      map(R.mergeAll)
    );

    submit$.subscribe(x => {
      sendMessage(x);
      this.event('close-modal');
    });

    captionNode.focus();
    return this;
  }
}

Component.init(ModalSendPhoto, 'modal-send-photo', {attributes, properties});
