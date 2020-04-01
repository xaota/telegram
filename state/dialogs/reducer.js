import {LOAD_DIALOGS, DIALOGS_LOAD_FAILED, DIALOGS_LOADED} from'./constants.js';

const {isActionOf, buildReducer} = store;


const handleLoadingTrue = R.pipe(
  R.nth(0),
  R.of,
  R.ap([
    R.identity,
    R.always({dialogsLoading: true}),
  ]),
  R.mergeAll,
);

const handleDialogsLoadFailed = R.pipe(
  R.nth(0),
  R.omit(['dialogsLoading']),
);

const handleDialogsLoaded = R.pipe(
  R.nth(0),
  R.omit(['dialogsLoading']),
);


export default buildReducer({}, [
  [isActionOf(LOAD_DIALOGS), handleLoadingTrue],
  [isActionOf(DIALOGS_LOAD_FAILED), handleDialogsLoadFailed],
  [isActionOf(DIALOGS_LOADED), handleDialogsLoaded],
]);