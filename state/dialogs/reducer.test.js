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
    const action = {
      type: DIALOGS_LOAD_FAILED
    };

    const state = {dialogsLoading: true};

    expect(reducer(state, action)).toEqual({});
  });

  describe('DIALOGS_LOADED', () => {
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
        'peer_user_77700': construct('dialog', {
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
        'peer_user_516572': construct('dialog', {
          pinned: false,
          unread_mark: false,
          peer: construct('peerUser', {user_id: 516572}),
          top_message: 198,
          read_inbox_max_id: 0,
          read_outbox_max_id: 0,
          unread_count: 0,
          unread_mentions_count: 0,
          notify_settings: construct('peerNotifySettings', {})
        })
      }
    });
  });
});

