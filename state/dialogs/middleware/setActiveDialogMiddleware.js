import {loadDialogHistory} from '../actions.js';
import {SET_ACTIVE_DIALOG} from '../constants.js';
import {isAuthKeyCreated} from '../../utils.js';
import {getInputPeerSelectorByPeerId} from '../helpers.js';

const {of, fromEvent} = rxjs;
const {filter, map, switchMapTo, distinctUntilChanged, withLatestFrom} = rxjs.operators;

const {isActionOf} = store;
const {method} = zagram;

/**
 * Loads mtproto connection
 * @param {Observable<*>} action$ - stream of current actions
 * @paraml {Observable<*>} state$ - stream of current state
 * @param {MTProto} connection - connection with telegram server
 */
export default function setActiveDialogMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const activeDialogChanged$ = authKeyCreated$.pipe(
    switchMapTo(action$),
    filter(isActionOf(SET_ACTIVE_DIALOG)),
    map(R.prop('payload'))
  );

  const dialogPeerSelector$ = activeDialogChanged$.pipe(
    distinctUntilChanged(),
    map(getInputPeerSelectorByPeerId)
  );

  const dialogPeer$ = dialogPeerSelector$.pipe(
    withLatestFrom(state$),
    map(R.apply(R.call))
  );

  dialogPeer$.subscribe(inputPeer => {
    connection.request(method(
      'messages.getHistory',
      {
        peer: inputPeer,
        offset_id: 0,
        offset_date: 0,
        add_offset: 0,
        limit: 20,
        max_id: 0,
        min_id: 0,
        hash: 0
      }
    ));
  });
}
