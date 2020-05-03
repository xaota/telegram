import {SET_SIDE_BAR, SET_SEARCH_BAR, SET_MESSAGE_SPLASH_SCREEN} from './constants.js';
import {getState, getActionPayload, applyAll} from '../utils.js';
const {buildReducer, isActionOf} = store;

const sidebarLens = R.lensProp('sidebar');

const splashScreenMessageLens = R.lensProp('splashScreenMessage');

const searchbarLens = R.lensProp('searchbar');

const handleSetSidebar = R.pipe(
  applyAll([
    R.always(sidebarLens),
    getActionPayload,
    getState
  ]),
  R.apply(R.set),
);

const handleSetSplashScreenMessage = R.pipe(
  R.of,
  R.ap([
    R.always(splashScreenMessageLens),
    getActionPayload,
    getState
  ]),
  R.apply(R.set)
);

const handleSetSearchbar = R.pipe(
  applyAll([
    R.always(searchbarLens),
    getActionPayload,
    getState
  ]),
  R.apply(R.set),
);

export default buildReducer({}, [
  [isActionOf(SET_SIDE_BAR), handleSetSidebar],
  [isActionOf(SET_MESSAGE_SPLASH_SCREEN), handleSetSplashScreenMessage],
  [isActionOf(SET_SEARCH_BAR), handleSetSearchbar]
]);
