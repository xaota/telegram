/* eslint-disable */
const { dispatch } = store;

import { SET_PAGE } from './constants.js';

export const setPage = R.partial(dispatch, [SET_PAGE]);
