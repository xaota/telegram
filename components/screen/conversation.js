import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getActiveDialogInfo$, getActiveDialogId$} from '../../state/dialogs/stream-builders.js';
import {getDialogTitle} from '../../state/dialogs/helpers.js';

/* eslint-disable */
import AppHeader   from '../app/header.js';
import AppMessage  from '../app/message.js';
import ScreenField from '../screen/field.js';

import MessageText from '../messages/text.js';
/* eslint-enable */

const {map} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100wh;
    max-height: 100wh;
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
    flex-direction: column;
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

/**
 * @param state - of app
 * @returns - full info about dialog
 */
const getActiveDialogInfo = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.path(['dialogs', 'activeDialog']),
      R.propOr(null)
    ),
    R.path(['dialogs', 'dialogs'])
  ]),
  R.apply(R.call)
);

const attributes = {};
const properties = {};

/** {ScreenConversation} @class
  * @description Отображение раздела беседы
  */
export default class ScreenConversation extends Component {
  static template = html`
      <template>
        <style>${style}</style>
          <div class="header-area">
            <app-header find more>
              <span>ui-avatar + caption + ui-online</span>
            </app-header>
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

    activeDialogId$.subscribe(() => {
      console.log('Scroll down');
      msgAreaInnerNode.scrollTop = msgAreaInnerNode.scrollHeight - msgAreaInnerNode.clientHeight;
    });

    activeDialog$.subscribe((dialog) => {
      this.store({dialog});
    });
    return super.mount(node, attributes, properties);
  }

  render(node) {
    const {dialog} = this.store();
    if (R.isNil(dialog)) {
      return this;
    }
    const title = getDialogTitle(dialog);

    const appHeaderNode = $('app-header', node);
    const appTitleNode = $('app-header > span', node);
    appTitleNode.innerText = title;
    appTitleNode.slot = "data"
    appHeaderNode.find = false;
    appHeaderNode.more = false;
    return this;
  }
}

Component.init(ScreenConversation, 'screen-conversation', {attributes, properties});
