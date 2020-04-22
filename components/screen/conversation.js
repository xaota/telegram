import Component, {html, css} from '../../script/ui/Component.js';

/* eslint-disable */
import AppHeader   from '../app/header.js';
import AppMessage  from '../app/message.js';
import ScreenField from '../screen/field.js';

import MessageText from '../messages/text.js';
/* eslint-enable */

const {map} = rxjs.operators;

const style = css``;

/**
 * @param state - of app
 * @returns - full info about dialog
 */
const getActiveDialogInfo = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.path(['dialogs', 'activeDialog']),
      R.propOr(null),
    ),
    R.path(['dialogs', 'dialogs'])
  ]),
  R.apply(R.call),
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
        <app-header find more>
          <span>ui-avatar + caption + ui-online</span>
        </app-header>

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

        <screen-field></screen-field>
      </template>`;

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {ScreenConversation} текущий компонент
    */
  mount(node) {
    const state$ = getState$();
    const activeDialog$ = state$
      .pipe(map(getActiveDialogInfo))

    activeDialog$.subscribe(console.log);
    return super.mount(node, attributes, properties);
  }
}

Component.init(ScreenConversation, 'screen-conversation', {attributes, properties});
