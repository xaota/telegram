import {isAuthKeyCreated, requestToTelegram$} from '../../utils.js';
import {LOAD_STICKER_SET} from '../constants.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';
import {setDocumentBatch} from '../actions.js';

const {fromEvent} = rxjs;
const {filter, map, switchMap, switchMapTo} = rxjs.operators;

const {method, construct} = zagram;
const {isActionOf} = store;

const buildRequest = R.pipe(
  R.partial(construct, ['inputStickerSetID']),
  wrapAsObjWithKey('stickerset'),
  R.partial(method, ['messages.getStickerSet'])
);

export default function loadStickerSetsMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const stickerSet$ = authKeyCreated$
    .pipe(
      switchMapTo(action$),
      filter(isActionOf(LOAD_STICKER_SET)),
      map(R.prop('payload')),
      map(buildRequest),
      switchMap(R.partial(requestToTelegram$, [connection]))
    );

  stickerSet$.subscribe(setDocumentBatch);
}
