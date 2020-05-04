import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getUserFullName} from '../../state/users/utils.js';

import PeerAvatar from '../ui/peer-avatar.js';
import {getUser$} from '../../state/users/stream-builders.js';
import {
  getMessageDateStr,
  getPeerIdFromMessage,
  getUserIdFromMessage
} from '../../script/utils/message.js';


const style = css`
  :host {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-height: 60px;
    justify-content: center;
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
    justify-content: center;
    flex-grow: 1;
  }
  
  
  #title {
    color: #fff;
    text-decoration: none;
  }
  
  #sub-info {
    color: #fff;
    font-size: 14px;
    font-weight: normal;
  }
`;

const attributes = {};
const properties = {};

export default class SplashScreenHeader extends Component {
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

  constructor(message) {
    super();
    this.store({message});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const {message} = this.store();

    const avatarNode = $('.avatar-place', node);
    const peerAvatar = new PeerAvatar(getPeerIdFromMessage(message));
    avatarNode.appendChild(peerAvatar);

    const state$ = getState$();
    const user$ = getUser$(state$, getUserIdFromMessage(message));
    user$.subscribe(user =>  {
      const title = getUserFullName(user);

      const titleNode = $('#title', node);
      titleNode.innerText = title;
    });

    const subInfoNode = $('#sub-info', node);
    subInfoNode.innerText = getMessageDateStr(message);
  }
}

Component.init(SplashScreenHeader, 'splash-screen-header', {attributes, properties});
