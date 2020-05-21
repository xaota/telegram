import {isAuthKeyCreated, requestToTelegram$} from '../../utils.js';
import {GET_ALL_STICKERS} from '../constants.js';
import {setAllStickerSets} from '../actions.js';

const {fromEvent} = rxjs;
const {filter, mapTo, switchMap, switchMapTo} = rxjs.operators;

const {method} = zagram;
const {isActionOf} = store;

export default function loadAllStickerSetsMiddleware(action$, state$, connection) {
  const authKeyCreated$ = fromEvent(connection, 'statusChanged')
    .pipe(filter(isAuthKeyCreated));

  const allStickerSets$ = authKeyCreated$
    .pipe(
      switchMapTo(action$),
      filter(isActionOf(GET_ALL_STICKERS)),
      mapTo(method('messages.getAllStickers')),
      switchMap(R.partial(requestToTelegram$, [connection]))
    );

  allStickerSets$.subscribe(setAllStickerSets);
}
