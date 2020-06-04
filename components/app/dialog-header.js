import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogId$,
  getPeerCommonInfoOfActiveDialog$
} from '../../state/dialogs/stream-builders.js';
import PeerAvatar from '../ui/peer-avatar.js';
import {getTitleFromPeerInfo, getMembersCountFromPeerInfo} from '../../state/dialogs/helpers.js';
import {openSideBar, closeSearchBar} from '../../state/ui/index.js';

const {fromEvent} = rxjs;
const {tap, distinctUntilChanged} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-height: 60px;
    align-items: center;
    flex-grow: 1;
  }
  
  :host .avatar-place {
    display: flex;
    width: 56px;
    height: 56px;
    padding-right: 8px;
  }
  
  :host .info-place {
    display: flex;
    flex-direction: column;
    align-items: space-around;
    flex-grow: 1;
  }
  
  
  #title {
    color: #222;
    text-decoration: none;
  }
  
  #sub-info {
    color: #707579;
    font-size: 14px;
    font-weight: normal;
  }
`;
const attributes = {};
const properties = {};


export default class DialogHeader extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="avatar-place" slot="data">
      </div>
      <div class="info-place" slot="data">
        <a href="#" id="title"></a>
        <small id="sub-info"></small>
      </div>
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);
    const avatarPlaceNode = $('.avatar-place', node);
    const titleNode = $('#title', node);

    const state$ = getState$();

    const activeDialogId$ = getActiveDialogId$(state$);
    activeDialogId$.pipe(distinctUntilChanged()).subscribe(dialogId => {
      if (R.isNil(dialogId)) {
        return;
      }
      const peerAvatar = new PeerAvatar(dialogId);
      avatarPlaceNode.innerHTML = '';
      avatarPlaceNode.appendChild(peerAvatar);
    });

    const activeDialogInfo$ = getPeerCommonInfoOfActiveDialog$(state$);
    activeDialogInfo$.subscribe(peerInfo => {
      this.store({peerInfo});
    });

    const titleClick$ = fromEvent(titleNode, 'click')
      .pipe(tap(e => e.preventDefault()));

    titleClick$.subscribe(() => {
      closeSearchBar();
      openSideBar();
    });
    return this;
  }

  render(node) {
    const {peerInfo} = this.store();

    if (R.isNil(peerInfo)) {
      return;
    }

    const titleNode = $('#title', node);
    const subInfo= $('#sub-info', node);

    titleNode.innerText = getTitleFromPeerInfo(peerInfo);
    subInfo.innerText = getMembersCountFromPeerInfo(peerInfo);
  }
}

Component.init(DialogHeader, 'dialog-header', {attributes, properties});
