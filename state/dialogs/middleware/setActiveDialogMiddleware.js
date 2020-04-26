import {loadDialogHistory, loadDialogMediaFiles} from '../actions.js';
import {SET_ACTIVE_DIALOG} from '../constants.js';
import {isAuthKeyCreated} from '../../utils.js';
import {getInputPeerSelectorByPeerId} from '../helpers.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';
import {getFullUser} from '../../users/index.js';
import {getFullChat} from '../../chats/index.js';

const {fromEvent} = rxjs;
const {filter, map, switchMapTo, distinctUntilChanged, withLatestFrom} = rxjs.operators;

const {isObjectOf} = zagram;
const {isActionOf} = store;

const isChatObject = R.anyPass([isObjectOf('inputPeerChannel'), isObjectOf('inputPeerChat')]);

const getFullInfoByInputPeerInfo = R.cond([
  [isObjectOf('inputPeerUser'), getFullUser],
  [isChatObject, getFullChat],
  [R.T, R.identity]
]);

const handleDialogChange = R.pipe(
  R.of,
  R.ap([
    loadDialogHistory,
    loadDialogMediaFiles
  ])
);

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

  dialogPeer$.subscribe(getFullInfoByInputPeerInfo);

  dialogPeer$
    .pipe(map(wrapAsObjWithKey('peer')))
    .subscribe(handleDialogChange);
}
