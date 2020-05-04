import {SEARCH_DIALOG_MESSAGES} from '../constants.js';
import {isAuthKeyCreated, requestToTelegram$} from '../../utils.js';
import {setUserList} from '../../users/index.js';
import {setChatList} from '../../chats/index.js';
import {setSearchedDialogMessages} from '../actions.js';

const {fromEvent} = rxjs;
const {filter, map, switchMapTo, switchMap} = rxjs.operators;

const {construct, method, isRpcError} = zagram;
const {isActionOf} = store;

const buildRequestObject = R.pipe(
  R.merge({
    q: "",
    filter: construct('inputMessagesFilterEmpty'),
    min_date: 0,
    max_date: 0,
    offset_id: 0,
    add_offset: 0,
    limit: 30,
    max_id: 0,
    min_id: 0,
    hash: 0
  }),
  R.partial(method, ['messages.search'])
);


const handleSearchResponseSuccess = R.pipe(
  x => {
    console.log('SEARCH MESSAGES:', x);
    return x;
  },
  R.of,
  R.ap([
    R.pipe(R.prop('users'), setUserList),
    R.pipe(R.prop('chats'), setChatList),
    R.pipe(R.prop('messages'), setSearchedDialogMessages)
  ])
);

const handleSearchResponse = R.cond([
  [isRpcError, console.warn],
  [R.T, handleSearchResponseSuccess]
]);

export default function searchDialogMessages(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const getLoadMessageStream = R.partial(requestToTelegram$, [connection]);

  const loadDialogMediaFiles$ = authKeyCreated$.pipe(
    switchMapTo(action$),
    filter(isActionOf(SEARCH_DIALOG_MESSAGES)),
    map(R.prop('payload')),
    map(buildRequestObject),
    switchMap(getLoadMessageStream)
  );

  loadDialogMediaFiles$.subscribe(handleSearchResponse);
}
