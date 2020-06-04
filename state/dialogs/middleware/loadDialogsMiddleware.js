import {LOAD_DIALOGS} from '../constants.js';
import {setDialogsLoaded, setLoadDialogsFailed, addMessagesBatch} from '../actions.js';
import {setUserList} from '../../users/index.js';
import {setChatList} from '../../chats/index.js';

const {from} = rxjs;
const {filter, switchMap, catchError} = rxjs.operators;
const {isActionOf} = store;
const {method, construct, isRpcError} = zagram;

function loadDialogsStream(connection, action) {
  return R.pipe(
    R.propOr({}, 'payload'),
    R.merge({
      limit: 20,
      offset_date: 0,
      offset_id: 0,
      offset_peer: construct('inputPeerEmpty'),
      hash: 0
    }),
    R.partial(method, ['messages.getDialogs']),
    x => from(connection.request(x)).pipe(catchError(R.of))
  )(action);
}

const handleFailedResponse = () => {
  setLoadDialogsFailed();
};

const handleSuccessResponse = R.pipe(
  R.of,
  R.ap([
    R.pipe(R.prop('dialogs'), setDialogsLoaded),
    R.pipe(R.prop('users'), setUserList),
    R.pipe(R.prop('chats'), setChatList),
    R.pipe(R.prop('messages'), addMessagesBatch)
  ])
);

const handleResponse = R.cond([
  [isRpcError, handleFailedResponse],
  [R.T, handleSuccessResponse]
]);

export default function loadDialogsMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', e => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const loadDialogs$  = action$.pipe(
        filter(isActionOf(LOAD_DIALOGS)),
        switchMap(R.partial(loadDialogsStream, [connection]))
      );

      loadDialogs$.subscribe(handleResponse);
    }
  });
}
