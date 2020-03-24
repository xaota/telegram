import { SET_PAGE } from './constants.js';

const { isActionOf, buildReducer } = store;

const handleSetPage = R.pipe(
  R.nth(1),
  R.prop('payload'),
);

export default buildReducer('login', [
  [isActionOf(SET_PAGE), handleSetPage],
]);
