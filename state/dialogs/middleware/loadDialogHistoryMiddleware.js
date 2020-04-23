import {LOAD_DIALOG_HISTORY} from '../constants.js';
import {isAuthKeyCreated, requestToTelegram$} from '../../utils.js';
import {setUserList} from '../../users/index.js';
import {setChatList} from '../../chats/index.js';
import {addMessagesBatch} from '../actions.js';

const {fromEvent} = rxjs;
const {filter, map, switchMap, switchMapTo} = rxjs.operators;

const {method, isRpcError} = zagram;

const {isActionOf} = store;

const buildRequestObject = R.pipe(
  R.merge({
    offset_id: 0,
    offset_date: 0,
    add_offset: 0,
    limit: 20,
    max_id: 0,
    min_id: 0,
    hash: 0
  }),
  R.partial(method, ['messages.getHistory'])
);

const handleSuccessResponse = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('users'), setUserList),
    R.pipe(R.prop('chats'), setChatList),
    R.pipe(R.prop('messages'), addMessagesBatch)
  ])
);

const handleResponse = R.pipe(R.cond([
    [isRpcError, console.warn],
    [R.T, handleSuccessResponse]
  ]));

/**
 * Loads messages on action to load them
 * @param action$
 * @param state$
 * @param connection
 */
export default function loadDialogHistoryMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const getLoadHistoryStream = R.partial(requestToTelegram$, [connection]);

  const loadDialogHistory$ = authKeyCreated$.pipe(
    switchMapTo(action$),
    filter(isActionOf(LOAD_DIALOG_HISTORY)),
    map(R.prop('payload')),
    map(buildRequestObject),
    switchMap(getLoadHistoryStream)
  );

  loadDialogHistory$.subscribe(handleResponse);
}
