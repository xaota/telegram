import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getActiveDialogId$} from '../../state/dialogs/stream-builders.js';
import {getSidebarStatus$} from '../../state/ui/stream-builders.js';

/* eslint-disable */
import LayoutSidebar      from './sidebar.js';
import ScreenEmpty        from '../screen/empty.js';
import ScreenConversation from '../screen/conversation.js';
/* eslint-enable */


const {distinctUntilChanged} = rxjs.operators;

function showScreenEmpty(node) {
  const screenEmpty = $('screen-empty', node);
  const screenConversation  = $('screen-conversation', node);

  screenEmpty.style.display = 'flex';
  screenConversation.style.display = 'none';
}


function showScreenConversation(node) {
  const screenEmpty = $('screen-empty', node);
  const screenConversation  = $('screen-conversation', node);

  screenEmpty.style.display = 'none';
  screenConversation.style.display = 'flex';
}


const style = css`
  :host {
    display: flex;
    flex-direction: row;
    max-height: 100wh;
    position: relative;
  }
  
  #conversation-place {
    display: flex;
    flex-direction: column;
    flex-grow: 1
  }
  
  #sidebar-place {
    display: flex;
    flex-grow: 0;
  }

  layout-sidebar {
    width: 320px;
  }
`;

const attributes = {};
const properties = {};

/** {LayoutConversation} @class
  * @description Отображение ряздела общения
  */
export default class LayoutConversation extends Component {
    static template = html`
      <template>
        <style>${style}</style>
          <div id="conversation-place">
            <screen-empty></screen-empty>
            <screen-conversation></screen-conversation>
          </div>
          <div id="sidebar-place">
          </div>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {LayoutConversation} текущий компонент
    */
  mount(node) {
    super.mount(node, attributes, properties);

    const state$ = getState$();
    getActiveDialogId$(state$).subscribe(dialogId => this.store({dialogId}));

    const sidebarStatus$ = getSidebarStatus$(state$);

    const sidebarPlaceNode = $('#sidebar-place', node);
    sidebarStatus$.pipe(distinctUntilChanged()).subscribe(status => {
      if (status) {
        const sidebar = new LayoutSidebar();
        sidebarPlaceNode.appendChild(sidebar);
      } else {
        sidebarPlaceNode.innerHTML = '';
      }
    });

    showScreenEmpty(node);
    return this;
  }

  render(node) {
    super.render(node);

    const {dialogId} = this.store();

    if (R.isNil(dialogId)) {
      showScreenEmpty(node);
    } else {
      showScreenConversation(node);
    }

    return this;
  }
}

Component.init(LayoutConversation, 'layout-conversation', {attributes, properties});
