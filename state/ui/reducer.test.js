import reducer from './reducer.js';
import {SET_SIDE_BAR, SET_SEARCH_BAR, SET_MESSAGE_SPLASH_SCREEN} from './constants.js';

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

  describe('SET_SEARCH_BAR', () => {
    it('open', () => {
      const state = {};
      const action = {
        type: SET_SEARCH_BAR,
        payload: true
      };

      expect(reducer(state, action)).toEqual({searchbar: true});
    });

    it('close', () => {
      const state = {searchbar: true};
      const action = {
        type: SET_SEARCH_BAR,
        payload: false
      };

      expect(reducer(state, action)).toEqual({searchbar: false});
    });
  });

  describe('SET_MESSAGE_SPLASH_SCREEN', () => {
    it('set value', () => {
      const state = {sidebar: true};
      const action = {
        type: SET_MESSAGE_SPLASH_SCREEN,
        payload: {
          messageId: 123123,
          dialogId: 'peer_user_77700'
        }
      };

      expect(reducer(state, action)).toEqual({
        sidebar: true,
        splashScreenMessage: {
          messageId: 123123,
          dialogId: 'peer_user_77700'
        }
      });
    });

    it('set null', () => {
      const state = {
        sidebar: true,
        splashScreenMessage: {
          messageId: 123123,
          dialogId: 'peer_user_77700'
        }
      };

      const action = {
        type: SET_MESSAGE_SPLASH_SCREEN,
        payload: null
      };

      expect(reducer(state, action)).toEqual({
        sidebar: true,
        splashScreenMessage: null
      });
    });
  });
});
