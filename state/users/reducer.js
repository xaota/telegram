import {SET_USER, SET_USER_LIST} from './constants.js';

const {buildReducer, isActionOf} = store;

const getState = R.nth(0);
const getAction = R.nth(1);

const buildUserObject = R.pipe(
  R.of,
  R.ap([
    R.prop('id'),
    R.identity
  ]),
  R.of,
  R.fromPairs
);

const getUserFromAction = R.pipe(
  getAction,
  R.prop('payload'),
  buildUserObject
);

const handleSetUser = R.pipe(
  R.of,
  R.ap([
    getState,
    getUserFromAction
  ]),
  R.mergeAll
);

const handleSetUserList = R.pipe(
  R.of,
  R.ap([
    getState,
    R.pipe(getAction, R.prop('payload'), R.map(buildUserObject), R.mergeAll)
  ]),
  R.mergeAll
);

export default buildReducer(
  {},
  [
    [isActionOf(SET_USER), handleSetUser],
    [isActionOf(SET_USER_LIST), handleSetUserList]
  ]
);
