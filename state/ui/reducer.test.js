import reducer from './reducer.js';
import {SET_SIDE_BAR} from './constants.js';

describe('ui', () => {
  describe('SET_SIDE_BAR', () => {
    it('open', () => {
      const state = {};
      const action = {
        type: SET_SIDE_BAR,
        payload: true
      };

      expect(reducer(state, action)).toEqual({sidebar: true});
    });

    it('close', () => {
      const state = {sidebar: true};
      const action = {
        type: SET_SIDE_BAR,
        payload: false
      };

      expect(reducer(state, action)).toEqual({sidebar: false});
    });
  });
});
