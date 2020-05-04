import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getUserFullName} from '../../state/users/utils.js';
import {formatDate, tgDate} from '../../script/helpers.js';
import PeerAvatar from '../ui/peer-avatar.js';
import {
  getMessageDateStr,
  getPeerIdFromMessage,
  getUserIdFromMessage
} from '../../script/utils/message.js';
import {getUser$} from '../../state/users/stream-builders.js';


const getAuthorName = R.pipe(
  R.prop('author'),
  getUserFullName
);

const getTextMessage = R.prop('message');

const getMessageDate = R.pipe(
  R.prop('date'),
  tgDate,
  formatDate
);

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-height: 60px;
    justify-content: flex-start;
    flex-grow: 1;
    padding: 8px;
    border-radius: 8px;
  }
  
  :host .avatar-place {
    display: flex;
    flex-shrink: 0;
    height: 56px;
    width: 56px;
    flex-grow: 0;
    padding-right: 8px;
  }
  
  :host .info-place {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    flex-grow: 1;
  }
  
  .common-info-place {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
  }
  
  .message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5f6369;
  }
  
  .date {
    float: right;
    font-size: .8rem;
    font-weight: 300;
    color: #5f6369;
    white-space: nowrap;
    flex-grow: 0;
    flex-shrink: 0;
  }
`;
const attributes = {};
const properties = {};
export default class SearchedPreview extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="avatar-place">
      </div>
      <div class="info-place">
        <div class="common-info-place">
            <div class="title"></div>
            <div class="date"></div>
        </div>
        <div class="message">
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
    const state$ = getState$();
    const {message} = this.store();
    const messageNode$ = $('.message', node);
    messageNode$.innerText = getTextMessage(message);

    const titleNode = $('.title', node);
    const userInfo$ = getUser$(state$, message.from_id);
    userInfo$.subscribe(userInfo => {
      titleNode.innerText = getUserFullName(userInfo);
    });

    const dateNode = $('.date', node);
    dateNode.innerText = getMessageDate(message);

    const avatarPlaceNode = $('.avatar-place', node);
    const peerAvatar = new PeerAvatar(getPeerIdFromMessage(message));
    avatarPlaceNode.appendChild(peerAvatar);
    return this;
  }
}

Component.init(SearchedPreview, 'searched-preview', {attributes, properties});
