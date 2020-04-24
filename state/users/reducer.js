import {SET_USER, SET_USER_LIST, SET_USER_FULL} from './constants.js';

const {buildReducer, isActionOf} = store;

const getState = R.nth(0);
const getAction = R.nth(1);

const buildUserObject = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.prop('id'),
      R.of,
      R.append(['base']),
      R.lensPath
    ),
    R.identity,
    R.always({})
  ]),
  R.apply(R.set)
);

const buildFullUserObject = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.path(['user', 'id']),
      R.of,
      R.append(['full']),
      R.lensPath
    ),
    R.identity,
    R.always({})
  ]),
  R.apply(R.set)
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
  R.apply(R.mergeDeepRight)
);

const handleSetUserList = R.pipe(
  R.of,
  R.ap([
    getState,
    R.pipe(getAction, R.prop('payload'), R.map(buildUserObject), R.mergeAll)
  ]),
  R.apply(R.mergeDeepRight)
);

const handleSetUserFull = R.pipe(
  R.of,
  R.ap([
    getState,
    R.pipe(getAction, R.prop('payload'), buildFullUserObject)
  ]),
  R.apply(R.mergeDeepRight)
);

export default buildReducer(
  {},
  [
    [isActionOf(SET_USER), handleSetUser],
    [isActionOf(SET_USER_LIST), handleSetUserList],
    [isActionOf(SET_USER_FULL), handleSetUserFull]
  ]
);
