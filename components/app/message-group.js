import Component, {html, css} from '../../script/ui/Component.js';
import PeerAvatar from '../ui/peer-avatar.js';
import {userIdToPeerId} from '../../state/users/utils.js';
import messageFactory from '../messages/index.js';
import {authorizedUser$} from '../../state/auth/stream-builders.js';
import $ from '../../script/ui/DOM.js';

const style = css`
  :host {
    margin-top: 16px;
  }
  
  .app-message {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas:". avatar ."
                        ". content ."
                        ". markup .";
    justify-items: center;
    align-items: end;
    grid-column-gap: 4px;
    grid-row-gap: 2px;

    --avatar: 30px;
  }

  .app-message.left {
    grid-template-areas:"avatar content ."
                        ". markup .";
    grid-template-columns: calc(3em + 8px) auto calc(3em + 8px);
    justify-items: start;
  }

  .app-message.right {
    grid-template-areas:". content avatar"
                        ". markup .";
    grid-template-columns: calc(3em + 8px) auto calc(3em + 8px);
    justify-items: end;
  }


  .content { /* содержимое сообщения */
    grid-area: content;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }

  .left .content {
    align-items: flex-start;
  }

  .right .content {
    align-items: flex-end;
  }

  .content * {
    margin-top: 4px;
  }

  
  div.avatar {
    grid-area: avatar;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    height: 100%;
  }
  
  .left div.avatar-place {
    padding-left: 8px;
  }
  
  .avatar-place{
    flex-grow: 0;
    flex-shrink: 1;
    width: 2rem;
    height: 2rem;
  }

  .markup {
    display: inline-block;
    grid-area: markup;
    width: 100%;
  }

  .markup {
    width: 100%;
  }`;

const attributes = {};
const properties = {};

/** {AppMessageGroup} @class
  * @description Отображение сообщения
  */
export default class AppMessageGroup extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="app-message">
        <div class="avatar">
            <div class="avatar-place"></div>
        </div>
        <div class="content"></div>
        <div class="markup"></div>
      </div>
    </template>`;

  // /** Создание компонента {AppMessageGroup} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }
  constructor(messageGroup) {
    super();
    this.store({messageGroup});
  }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {AppMessageGroup} текущий компонент
    */
  mount(node) {
    super.mount(node, attributes, properties);
    const state$  = getState$();
    authorizedUser$(state$).subscribe(authorizedUser => this.store({authorizedUser}));

    return this;
  }

  render(node) {
    const appMessageNode = $('.app-message', node);
    const {messageGroup, authorizedUser} = this.store();
    if (R.isNil(authorizedUser)) {
      return this;
    }
    const authorizedUserMessage = (
      messageGroup[0].from_id === authorizedUser.id ||
      R.has('random_id', messageGroup[0])
    );

    if (authorizedUserMessage) {
      appMessageNode.classList.add('right');
    } else if (R.has('from_id', messageGroup[0])) {
      appMessageNode.classList.add('left');

      const avatarPlaceNode = $('.avatar-place', node);
      const peerAvatar = new PeerAvatar(userIdToPeerId(messageGroup[0].from_id));
      avatarPlaceNode.appendChild(peerAvatar);
    }

    for (let j = 0; j < messageGroup.length; j++) {
      const message = messageFactory(messageGroup[j]);

      const contentNode = $('.content', node);
      contentNode.appendChild(message);
    }
    return this;
  }
}

Component.init(AppMessageGroup, 'app-message-group', {attributes, properties});

// #region [Private]

// #endregion
