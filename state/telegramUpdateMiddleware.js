import {setChatList} from './chats/index.js';
import {setUserList} from './users/index.js';

const {of, fromEvent, merge} = rxjs;
const {map, filter, tap, switchMap} = rxjs.operators;

const {isObjectOf} = zagram;

const updateStateWithChats = R.pipe(R.prop('chats'), setChatList);
const updateStateWithUsers = R.pipe(R.prop('users'), setUserList);

const updateChatsUsersInfo = R.pipe(
  R.of,
  R.ap([
    updateStateWithChats,
    updateStateWithUsers
  ])
);


export default function telegramUpdateMiddleware(action$, state$, connection) {
  const telegramUpdate$ = fromEvent(connection, 'telegramUpdate')
    .pipe(map(R.prop('detail')));

  const updateShort$ = telegramUpdate$
    .pipe(
      filter(isObjectOf('updateShort')),
      map(R.prop('update'))
    );

  const updateShortMessage$ = telegramUpdate$.pipe(filter(isObjectOf('updateShortMessage')));
  updateShortMessage$.subscribe(x => console.log('[UPDATE SHORT MESSAGE]:', x));

  const updateShortChatMessage$ = telegramUpdate$.pipe(filter(isObjectOf('updateShortChatMessage')));

  updateShortChatMessage$.subscribe(x => console.log('[UPDATE SHOT CHAT MESSAGE]', x));

  const updates$ = telegramUpdate$.pipe(
    filter(isObjectOf('updates')),
    tap(updateChatsUsersInfo),
    switchMap(R.pipe(
      R.prop('updates'),
      R.apply(of)
    ))
  );

  const update$ = merge(updates$, updateShort$);
  const newMessage$ = update$.pipe(filter(R.anyPass([
      isObjectOf('updateNewChannelMessage'),
      isObjectOf('updateNewMessage')
    ])));

  newMessage$.subscribe(x => {
    console.log('New message:', R.prop('message', x));
  });
}
