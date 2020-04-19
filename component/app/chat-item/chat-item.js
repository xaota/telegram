import Component from '../../../script/Component.js';
import {updateChildrenHTML, updateChildrenText} from '../../../script/DOM.js';
import {dateDay, formatDate, wrapAsObjWithKey} from '../../../script/helpers.js';
/* eslint-disable */
import UIAvatar from '../../ui/avatar/ui-avatar.js'
import AppMessage from '../message/app-message.js'
import {peerIdToPeer} from '../../../state/utils.js'
import {getDialogWithLastMessage} from '../../../state/dialogs/helpers.js'
/* eslint-enable */
const {combineLatest} = rxjs;
const {map, distinctUntilChanged} = rxjs.operators;
const {isObjectOf} = zagram;


const buildUserByIdSelector = R.pipe(
  R.prop('user_id'),
  R.partialRight(R.append, [['users']]),
  R.path
);


const buildChatByIdSelector = R.pipe(
  R.prop('chat_id'),
  R.partialRight(R.append, [['chats']]),
  R.path
);

const buildChannelByIdSelector = R.pipe(
  R.prop('channel_id'),
  R.partialRight(R.append, [['chats']]),
  R.path
);

const getPeerInfoSelectorByPeerId = R.pipe(
  peerIdToPeer,
  R.cond([
    [isObjectOf('peerUser'), buildUserByIdSelector],
    [isObjectOf('peerChat'), buildChatByIdSelector],
    [R.T, buildChannelByIdSelector]
  ])
);

const getDialogTitle = R.pipe(
  R.prop('peer_info'),
  R.cond([
    [R.equals(undefined), R.always('dialog')],
    [isObjectOf('user'), R.prop('first_name')],
    [isObjectOf('chat'), R.prop('title')],
    [isObjectOf('channel'), R.prop('title')],
    [R.T, R.always('dialog')]
  ])
);

const getIdFromPeer = R.pipe(
  R.prop('peer_info'),
  R.cond([
    [R.equals(undefined), R.always(0)],
    [R.T, R.prop('id')]
  ])
);

const component = Component.meta(import.meta.url, 'chat-item');
const attributes = {
    badge(root, value) { updateChildrenHTML(root, 'ui-badge', value); },
    status(root, value) { updateChildrenText(root, '#status', value); },
    timestamp(root, value) { updateChildrenHTML(root, 'div.dialog__date > span.timestamp', value); }
  };

const properties = {

  };

export default class ChatItem extends Component {
  constructor(dialogId) {
    super(component);
    this.dialogId = dialogId;
  }

  mount(node) {
    super.mount(node, attributes, properties);
  }

  /**
   * Builds chat item
   * @param dialogId
   * @return {ChatItem}
   */
  static from(dialogId) {
    const avatar     = new UIAvatar();
    avatar.innerHTML = UIAvatar.letter(dialogId);
    avatar.color     = UIAvatar.color(dialogId);
    avatar.slot      = 'avatar';

    const title     = document.createElement('span');
    title.innerText = dialogId;
    title.slot      = 'title';

    const message = document.createElement('span');
    message.innerText = 'initial message';
    message.slot      = 'message';


    const item = new ChatItem(dialogId);
    item.append(avatar);
    item.append(title);
    item.append(message);

    const state$ = getState$();
    const dialog$ = state$.pipe(
      map(R.path(['dialogs', 'dialogs', dialogId])),
      map(getDialogWithLastMessage),
      distinctUntilChanged()
    );

    const peerInfo$ = state$.pipe(
      map(getPeerInfoSelectorByPeerId(dialogId)),
      map(wrapAsObjWithKey('peer_info'))
    );

    const dialogInfo$ = combineLatest(dialog$, peerInfo$).pipe(map(R.mergeAll));

    dialogInfo$.subscribe(model => {
      const dialogTitle = getDialogTitle(model);
      title.innerText = dialogTitle;
      avatar.innerHTML = UIAvatar.letter(dialogTitle);
      avatar.color     = UIAvatar.color(getIdFromPeer(model));

      if (model.unread_count > 0) {
        item.setAttribute('badge', model.unread_count);
      }

      if (R.pathOr(0, ['notify_settings', 'mute_until'], model) !== 0) {
        item.setAttribute('muted', '');
      }
      if (model.pinned) {
        item.setAttribute('pin', '');
      }

      if (model.last_message) {
        message.innerText = AppMessage.preview(model.last_message);

        const current = formatDate(dateDay(), true);
        const updated = formatDate(dateDay(model.last_message.date * 1000), true);
        const timestamp = current === updated ? AppMessage.timestamp(model.last_message.date) : updated;
        item.setAttribute('timestamp', timestamp);
      } else {
        message.innerText = 'not a message';
      }
    });

    return item;
  }
}

Component.init(ChatItem, component, {attributes, properties});
