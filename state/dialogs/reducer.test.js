import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED
} from './constants.js';

import reducer from './reducers.js';

describe('dialogs', () => {
  describe('LOAD_DIALOGS', () => {
    it('first load', () => {
      const action = {
        type: LOAD_DIALOGS,
      }

      const state = {};

      expect(reducer(state, action)).toEqual({
        dialogsLoading: true,
      });
    });
  });

  describe('LOAD_DIALOGS_FAILED', () => {
    const action = {
      type: DIALOGS_LOAD_FAILED,
    };

    const state = {dialogsLoading: true};

    expect(reducer(state, action)).toEqual({});
  });

  describe('DIALOGS_LOADED', () => {
    const action = {
      type: DIALOGS_LOADED,
    };

    const state = {dialogsLoading: true};

    expect(reducer(state, action)).toEqual({});
  });
});

