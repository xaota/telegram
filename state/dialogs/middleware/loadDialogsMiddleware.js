import {LOAD_DIALOGS} from '../constants.js'

const {from} = rxjs;
const {filter, switchMap, catchError} = rxjs.operators;
const {isActionOf} = store;
const {method, construct} = zagram;


function loadDialogsStream(connection, action) {
  console.log('Load dialogs with action', action);
  return R.pipe(
    R.always({
      limit: 20,
      offset: 0,
      offset_id: 0,
      offset_peer: construct('inputPeerEmpty'),
      hash: 0,
    }),
    R.partial(method, ['messages.getDialogs']),
    x => from(connection.request(x)).pipe(catchError(R.of)),
  )(action);
}

export default function loadDialogsMiddleware(action$, state$, connection) {
  connection.addEventListener('statusChanged', (e) => {
    if (e.status === 'AUTH_KEY_CREATED') {
      const loadDialogs$  = action$.pipe(
        filter(isActionOf(LOAD_DIALOGS)),
        switchMap(R.partial(loadDialogsStream, [connection]))
      );

      loadDialogs$.subscribe(console.log);
    }
  });
}