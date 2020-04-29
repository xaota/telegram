import {SET_SIDE_BAR, SET_MESSAGE_SPLASH_SCREEN} from './constants.js';
import {getState, getActionPayload} from '../utils.js';
const {buildReducer, isActionOf} = store;

const sidebarLens = R.lensProp('sidebar');

const handleSetSidebar = R.pipe(
  R.of,
  R.ap([
    R.always(sidebarLens),
    getActionPayload,
    getState
  ]),
  R.apply(R.set)
);

const splashScreenMessageLens = R.lensProp('splashScreenMessage');

const handleSetSplashScreenMessage = R.pipe(
  R.of,
  R.ap([
    R.always(splashScreenMessageLens),
    getActionPayload,
    getState
  ]),
  R.apply(R.set)
);

export default buildReducer({}, [
  [isActionOf(SET_SIDE_BAR), handleSetSidebar],
  [isActionOf(SET_MESSAGE_SPLASH_SCREEN), handleSetSplashScreenMessage]
]);
