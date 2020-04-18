import reducer from './reducer.js';
import {SET_CHAT, SET_CHAT_LIST} from './constants.js';

const {construct} = zagram;

describe('chats reducer', () => {
  describe('SET_CHAT', () => {
    it('test first chat', () => {
      const state = {};
      const action = {
        type: SET_CHAT,
        payload: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        )
      };

      expect(reducer(state, action)).toEqual({
        123981462: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        )
      });
    });

    it('test one more chat', () => {
      const state = {
        123981462: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        )
      };
      const action = {
        type: SET_CHAT,
        payload: construct(
          'chatForbidden',
          {
            id: 140305002,
            title: "React.js" 
          }
        )
      };

      expect(reducer(state, action)).toEqual({
        123981462: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        ),
        140305002: construct(
          'chatForbidden',
          {
            id: 140305002,
            title: "React.js" 
          }
        )
      });
    });
  });

  describe('SET_CHAT_LIST', () => {
    it('test', () => {
      const state = {};
      const action = {
        type: SET_CHAT_LIST,
        payload: [
          construct(
            'chatForbidden',
            {
              id: 123981462,
              title: "UFACODER"
            }
          ),
          construct(
            'chatForbidden',
            {
              id: 140305002,
              title: "React.js" 
            }
          )
        ]
      };

      expect(reducer(state, action)).toEqual({
        123981462: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        ),
        140305002: construct(
          'chatForbidden',
          {
            id: 140305002,
            title: "React.js" 
          }
        )
      });
    });
  });
});
