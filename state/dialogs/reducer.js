import {LOAD_DIALOGS, DIALOGS_LOAD_FAILED, DIALOGS_LOADED} from './constants.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';
import {peerToPeerId} from '../utils.js';

const {isActionOf, buildReducer} = store;


const getState = R.nth(0);

const getAction = R.nth(1);


const handleLoadingTrue = R.pipe(
  R.nth(0),
  R.of,
  R.ap([
    R.identity,
    R.always({dialogsLoading: true})
  ]),
  R.mergeAll
);


const unsetLoading = R.omit(['dialogsLoading']);

const removeLoadingFromState = R.pipe(
  getState,
  unsetLoading
);


const getPeerFormDialog = R.prop('peer');

const getPeerIdFromDialog = R.pipe(getPeerFormDialog, peerToPeerId);

const buildDialogsOrder = R.pipe(
  getAction,
  R.prop('payload'),
  R.map(getPeerIdFromDialog),
  wrapAsObjWithKey('dialogsOrder')
);

const buildDialogsPair = R.pipe(
  R.of,
  R.ap([getPeerIdFromDialog, R.identity])
);

const buildDialogsMap = R.pipe(
  getAction,
  R.prop('payload'),
  R.map(buildDialogsPair),
  R.fromPairs,
  wrapAsObjWithKey('dialogs')
);

const handleDialogsLoadFailed = removeLoadingFromState;


const handleDialogsLoaded = R.pipe(
  R.of,
  R.ap([
    removeLoadingFromState,
    buildDialogsOrder,
    buildDialogsMap
  ]),
  R.mergeAll
);


export default buildReducer({}, [
  [isActionOf(LOAD_DIALOGS), handleLoadingTrue],
  [isActionOf(DIALOGS_LOAD_FAILED), handleDialogsLoadFailed],
  [isActionOf(DIALOGS_LOADED), handleDialogsLoaded]
]);
