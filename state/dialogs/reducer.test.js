import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED
} from './constants.js';

import reducer from './reducer.js';

const {construct} = zagram;

describe('dialogs', () => {
  describe('LOAD_DIALOGS', () => {
    it('first load', () => {
      const action = {
        type: LOAD_DIALOGS
      };

      const state = {};

      expect(reducer(state, action)).toEqual({
        dialogsLoading: true
      });
    });
  });

  describe('LOAD_DIALOGS_FAILED', () => {
    it('test', () => {
      const action = {
        type: DIALOGS_LOAD_FAILED
      };

      const state = {dialogsLoading: true};

      expect(reducer(state, action)).toEqual({});
    });
  });

  describe('DIALOGS_LOADED', () => {
    it('test', () => {
      const action = {
        type: DIALOGS_LOADED,
        payload: [
          construct(
            'dialog',
            {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 77700}),
              top_message: 208,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }
          ),
          construct(
            'dialog',
            {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {user_id: 516572}),
              top_message: 198,
              read_inbox_max_id: 0,
              read_outbox_max_id: 0,
              unread_count: 0,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }
          )
        ]
      };

      const state = {dialogsLoading: true};

      expect(reducer(state, action)).toEqual({
        dialogsOrder: [
          'peer_user_77700',
          'peer_user_516572'
        ],
        dialogs: {
          'peer_user_77700': {
            info: construct('dialog', {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 77700}),
              top_message: 208,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [],
            messages: {}
          },
          'peer_user_516572': {
            info: construct('dialog', {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {user_id: 516572}),
              top_message: 198,
              read_inbox_max_id: 0,
              read_outbox_max_id: 0,
              unread_count: 0,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [],
            messages: {}
          }
        }
      });
    });
  });

  describe('ADD_MESSAGE', () => {
    it('test', () => {
      const state = {
        dialogsOrder: [
          'peer_user_77700'
        ],
        dialogs: {
          'peer_user_77700': {
            info: construct('dialog', {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 77700}),
              top_message: 208,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            })
          }
        }
      };

      const action = {
        type: 'ADD_MESSAGE',
        payload: construct(
          'message',
          {
            date: 1587231833,
            edit_hide: false,
            from_id: 2443566,
            from_scheduled: false,
            id: 313079,
            legacy: false,
            media_unread: false,
            mentioned: false,
            message: "И не поспоришь",
            out: true,
            post: false,
            silent: false,
            to_id: construct('peerUser', {'user_id': 77700})
          }
        )
      };

      expect(reducer(state, action)).toEqual({
        dialogsOrder: [
          'peer_user_77700'
        ],
        dialogs: {
          'peer_user_77700': {
            info: construct('dialog', {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 77700}),
              top_message: 208,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [
              313079
            ],
            messages: {
              313079: construct(
                'message',
                {
                  date: 1587231833,
                  edit_hide: false,
                  from_id: 2443566,
                  from_scheduled: false,
                  id: 313079,
                  legacy: false,
                  media_unread: false,
                  mentioned: false,
                  message: "И не поспоришь",
                  out: true,
                  post: false,
                  silent: false,
                  to_id: construct('peerUser', {'user_id': 77700})
                }
              )
            }
          }
        }
      });
    });
  });
});

