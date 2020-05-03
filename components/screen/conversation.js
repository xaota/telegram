import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {
  getActiveDialogInfo$,
  getActiveDialogId$,
  getActiveDialogMessages$,
  getNextHistoryLoader$
} from '../../state/dialogs/stream-builders.js';
import {loadDialogHistory} from '../../state/dialogs/actions.js';
import {authorizedUser$} from '../../state/auth/stream-builders.js';
import {userIdToPeerId} from '../../state/users/utils.js';

/* eslint-disable */
import AppHeader   from '../app/header.js';
import ScreenField from '../screen/field.js';
import DialogHeader from '../app/dialog-header.js';
import PeerAvatar from '../ui/peer-avatar.js'
/* eslint-enable */

import AppMessage  from '../app/message.js';

import MessageText from '../messages/text.js';
import MessagePhoto from '../messages/photo.js';

const {fromEvent} = rxjs;
const {map, distinctUntilChanged, withLatestFrom} = rxjs.operators;

const style = css`
  :host {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header-area {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
  }

  .message-area {
    overflow-y: auto;
    height: 0px;
    justify-content: flex-end;
    flex-grow: 1;
  }

  .message-area-inner {
    display: flex;
    flex-direction: column-reverse;
    min-height: 100%;
    justify-content: flex-end;
  }

  .send-message-area {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
    flex-grow: 0;
  }
`;


const attributes = {};
const properties = {};


/** {ScreenConversation} @class
  * @description Отображение раздела беседы
  */
export default class ScreenConversation extends Component {
  static template = html`
      <template>
        <style>${style}</style>
          <div class="header-area"> <!-- зачем обертка? -->
            <app-header find more>
              <dialog-header slot="data"></dialog-header>
            </app-header>
          </div>


        <div class="load-more-area">
          <button class="load-more">load-more</button>
        </div>

        <div class="message-area">
          <div class="message-area-inner">
          <app-message data-hash="1587063600000x1">
            <message-system>
              <span slot="content">Apr 17</span>
            </message-system>
          </app-message>

          <app-message left="" data-hash="169239117824x5">
            <ui-avatar color="#409ADB" slot="avatar" src="" style="background-color: rgb(64, 154, 219);">F</ui-avatar>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="author">Fill </span>
              <span slot="content">когда плохо живешь</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">от любой инициативы ждешь говна</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">ну и ведро с крабами</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">меня некоторые люди буквально НЕНАВИДЯТ за то, что я пишу статьи</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">писали в лс, что желают мне смерти и вот такое всё</span>
            </message-text>
          </app-message>

          <app-message right="" data-hash="169245409280x2">
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">А мне нравится</span>
            </message-text>
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">Не знаю почему</span>
            </message-text>
          </app-message>
          <app-message data-hash="1587063600000x1">
            <message-system>
              <span slot="content">Apr 17</span>
            </message-system>
          </app-message>

          <app-message left="" data-hash="169239117824x5">
            <ui-avatar color="#409ADB" slot="avatar" src="" style="background-color: rgb(64, 154, 219);">F</ui-avatar>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="author">Fill </span>
              <span slot="content">когда плохо живешь</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">от любой инициативы ждешь говна</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">ну и ведро с крабами</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">меня некоторые люди буквально НЕНАВИДЯТ за то, что я пишу статьи</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">писали в лс, что желают мне смерти и вот такое всё</span>
            </message-text>
          </app-message>

          <app-message right="" data-hash="169245409280x2">
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">А мне нравится</span>
            </message-text>
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">Не знаю почему</span>
            </message-text>
          </app-message>
          <app-message data-hash="1587063600000x1">
            <message-system>
              <span slot="content">Apr 17</span>
            </message-system>
          </app-message>

          <app-message left="" data-hash="169239117824x5">
            <ui-avatar color="#409ADB" slot="avatar" src="" style="background-color: rgb(64, 154, 219);">F</ui-avatar>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="author">Fill </span>
              <span slot="content">когда плохо живешь</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">от любой инициативы ждешь говна</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">ну и ведро с крабами</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">меня некоторые люди буквально НЕНАВИДЯТ за то, что я пишу статьи</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">писали в лс, что желают мне смерти и вот такое всё</span>
            </message-text>
          </app-message>

          <app-message right="" data-hash="169245409280x2">
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">А мне нравится</span>
            </message-text>
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">Не знаю почему</span>
            </message-text>
          </app-message>
          <app-message data-hash="1587063600000x1">
            <message-system>
              <span slot="content">Apr 17</span>
            </message-system>
          </app-message>

          <app-message left="" data-hash="169239117824x5">
            <ui-avatar color="#409ADB" slot="avatar" src="" style="background-color: rgb(64, 154, 219);">F</ui-avatar>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="author">Fill </span>
              <span slot="content">когда плохо живешь</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">от любой инициативы ждешь говна</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">ну и ведро с крабами</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">меня некоторые люди буквально НЕНАВИДЯТ за то, что я пишу статьи</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">писали в лс, что желают мне смерти и вот такое всё</span>
            </message-text>
          </app-message>

          <app-message right="" data-hash="169245409280x2">
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">А мне нравится</span>
            </message-text>
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">Не знаю почему</span>
            </message-text>
          </app-message>
          <app-message data-hash="1587063600000x1">
            <message-system>
              <span slot="content">Apr 17</span>
            </message-system>
          </app-message>

          <app-message left="" data-hash="169239117824x5">
            <ui-avatar color="#409ADB" slot="avatar" src="" style="background-color: rgb(64, 154, 219);">F</ui-avatar>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="author">Fill </span>
              <span slot="content">когда плохо живешь</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">от любой инициативы ждешь говна</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">ну и ведро с крабами</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">меня некоторые люди буквально НЕНАВИДЯТ за то, что я пишу статьи</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">писали в лс, что желают мне смерти и вот такое всё</span>
            </message-text>
          </app-message>

          <app-message right="" data-hash="169245409280x2">
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">А мне нравится</span>
            </message-text>
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">Не знаю почему</span>
            </message-text>
          </app-message>
          <app-message data-hash="1587063600000x1">
            <message-system>
              <span slot="content">Apr 17</span>
            </message-system>
          </app-message>

          <app-message left="" data-hash="169239117824x5">
            <ui-avatar color="#409ADB" slot="avatar" src="" style="background-color: rgb(64, 154, 219);">F</ui-avatar>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="author">Fill </span>
              <span slot="content">когда плохо живешь</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">от любой инициативы ждешь говна</span>
            </message-text>
            <message-text left="" timestamp="22:38" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">ну и ведро с крабами</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">меня некоторые люди буквально НЕНАВИДЯТ за то, что я пишу статьи</span>
            </message-text>
            <message-text left="" timestamp="22:39" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">писали в лс, что желают мне смерти и вот такое всё</span>
            </message-text>
          </app-message>

          <app-message right="" data-hash="169245409280x2">
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">А мне нравится</span>
            </message-text>
            <message-text right="" timestamp="02:12" color="#409ADB" style="--color:#409ADB;">
              <span slot="content">Не знаю почему</span>
            </message-text>
          </app-message>

          </div>
        </div>

        <div class="send-message-area">
          <screen-field></screen-field>
        </div>
      </template>
`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenConversation} текущий компонент
    */
  mount(node) {
    const state$ = getState$();
    const activeDialog$ = getActiveDialogInfo$(state$);
    const activeDialogId$ = getActiveDialogId$(state$);
    const msgAreaInnerNode = $('.message-area', node);
    const loadMoreNode = $('.load-more', node);

    activeDialogId$.pipe(distinctUntilChanged()).subscribe(() => {
      msgAreaInnerNode.scrollTop = msgAreaInnerNode.scrollHeight - msgAreaInnerNode.clientHeight;
    });

    activeDialog$.subscribe(dialog => {
      this.store({dialog});
    });

    const dialogMessages$ = getActiveDialogMessages$(state$)
      .pipe(map(R.groupWith(R.eqProps('from_id'))));

    dialogMessages$.subscribe(groupedMessages => {
      this.store({groupedMessages});
    });

    authorizedUser$(state$).subscribe(authorizedUser => this.store({authorizedUser}));

    const nextHistoryLoader$ = getNextHistoryLoader$(state$);

    const loadMoreClick$ = fromEvent(loadMoreNode, 'click');
    const loadMore$ = loadMoreClick$.pipe(
      withLatestFrom(nextHistoryLoader$),
      map(R.nth(1))
    );

    loadMore$.subscribe(loadDialogHistory);

    const appHeaderNode = $('app-header', node);
    const searchClick$ = fromEvent(appHeaderNode, 'find');

    searchClick$.subscribe(() => {
      console.log('OPEN SEARCH SCREEN');
    });
    return super.mount(node, attributes, properties);
  }

  render(node) {
    const {dialog, authorizedUser, groupedMessages = []} = this.store();
    if (R.isNil(dialog)) {
      return this;
    }

    const messageAreaNode = $('.message-area-inner', node);
    messageAreaNode.innerHTML = '';

    for (let i = 0; i < groupedMessages.length; i++) {
      const messageGroup = groupedMessages[i];
      const appMessage = new AppMessage();

      const authorizedUserMessage = messageGroup[0].from_id === authorizedUser.id;

      if (R.has('from_id', messageGroup[0])) {
        if (authorizedUserMessage) {
          appMessage.setAttribute('right', true);
        } else {
          appMessage.setAttribute('left', true);

          const peerAvatar = new PeerAvatar(userIdToPeerId(messageGroup[0].from_id));
          peerAvatar.setAttribute('slot', 'avatar');
          appMessage.appendChild(peerAvatar);
        }
      }

      for (let j = 0; j < messageGroup.length; j++) {
        // console.log(messageGroup[j]);
        // debugger;

        const message = messageGroup[j]?.media?.photo
          ? new MessagePhoto(messageGroup[j].media.photo)
          : new MessageText();

          // media:
          // webpage:
          // @@constructor: "webPage"
          // @@type: "WebPage"
          // id: 5127856301970688130n
          // url: "https://youtu.be/UEwCD8PjrZI"
          // display_url: "youtube.com/watch?v=UEwCD8PjrZI"
          // hash: 0
          // type: "video"
          // site_name: "YouTube"
          // title: "Лох,Пидор"
          // description: "опасный поцик"
          // photo
          // embed_url: "https://www.youtube.com/embed/UEwCD8PjrZI"
          // embed_type: "iframe"
          // embed_width: 480
          // embed_height: 360

        if (authorizedUserMessage) {
          message.setAttribute('right', true);
        } else {
          message.setAttribute('left', true);
        }

        const span = document.createElement('span');
        span.setAttribute('slot', 'content');
        span.innerText = R.propOr('', 'message', messageGroup[j]);
        message.appendChild(span);

        message.timestamp = AppMessage.timestamp(messageGroup[j].date);

        if (messageGroup[j]?.media?.webpage) {
          message?.webpage(messageGroup[j].media.webpage);
        }

        appMessage.appendChild(message);
      }
      messageAreaNode.appendChild(appMessage);
    }

    return this;
  }
}

Component.init(ScreenConversation, 'screen-conversation', {attributes, properties});
