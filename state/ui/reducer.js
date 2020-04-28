import {SET_SIDE_BAR} from './constants.js';
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

export default buildReducer({}, [
  [isActionOf(SET_SIDE_BAR), handleSetSidebar]
]);
