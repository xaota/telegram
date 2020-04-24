import reducer from './reducer.js';
import {SET_CHAT, SET_CHAT_LIST, SET_FULL_CHAT} from './constants.js';

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
        123981462: {
          base: construct(
            'chatForbidden',
            {
              id: 123981462,
              title: "UFACODER"
            }
          )
        }
      });
    });

    it('test one more chat', () => {
      const state = {
        123981462: {
          base: construct(
            'chatForbidden',
            {
              id: 123981462,
              title: "UFACODER"
            }
          )
        }
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
        123981462: {
          base: construct(
            'chatForbidden',
            {
              id: 123981462,
              title: "UFACODER"
            }
          )
        },
        140305002: {
          base: construct(
            'chatForbidden',
            {
              id: 140305002,
              title: "React.js"
            }
          )
        }
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
        123981462: {
          base: construct(
            'chatForbidden',
            {
              id: 123981462,
              title: "UFACODER"
            }
          )
        },
        140305002: {
          base: construct(
            'chatForbidden',
            {
              id: 140305002,
              title: "React.js"
            }
          )
        }
      });
    });
  });

  describe('SET_FULL_CHAT', () => {
    const state = {
      123981462: {
        base: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        )
      }
    };

    const action = {
      type: SET_FULL_CHAT,
      payload: construct(
        'channelFull',
        {
          about: "",
          admins_count: 5,
          banned_count: 0,
          can_set_location: false,
          can_set_stickers: false,
          can_set_username: true,
          can_view_participants: true,
          can_view_stats: false,
          has_scheduled: false,
          hidden_prehistory: true,
          id: 123981462,
          kicked_count: 2,
          migrated_from_chat_id: 286120891,
          migrated_from_max_id: 272752,
          online_count: 6,
          participants_count: 30,
          pts: 48011,
          read_inbox_max_id: 46657,
          read_outbox_max_id: 46657,
          unread_count: 0
        }
      )
    };

    expect(reducer(state, action)).toEqual({
      123981462: {
        base: construct(
          'chatForbidden',
          {
            id: 123981462,
            title: "UFACODER"
          }
        ),
        full: construct(
          'channelFull',
          {
            about: "",
            admins_count: 5,
            banned_count: 0,
            can_set_location: false,
            can_set_stickers: false,
            can_set_username: true,
            can_view_participants: true,
            can_view_stats: false,
            has_scheduled: false,
            hidden_prehistory: true,
            id: 123981462,
            kicked_count: 2,
            migrated_from_chat_id: 286120891,
            migrated_from_max_id: 272752,
            online_count: 6,
            participants_count: 30,
            pts: 48011,
            read_inbox_max_id: 46657,
            read_outbox_max_id: 46657,
            unread_count: 0
          }
        )
      }
    });
  });
});
