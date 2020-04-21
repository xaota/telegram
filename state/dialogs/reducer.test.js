import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED,
  SET_ACTIVE_DIALOG
} from './constants.js';

import reducer from './reducer.js';
import {ADD_MESSAGES_BATCH} from './constants';

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

    it('test has got loaded before', () => {
      const state = {
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

      };

      const action = {
        type: DIALOGS_LOADED,
        payload: [
          construct(
            'dialog',
            {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 77711}),
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
              peer: construct('peerUser', {user_id: 516500}),
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

      expect(reducer(state, action)).toEqual({
        dialogsOrder: [
          'peer_user_77700',
          'peer_user_516572',
          'peer_user_77711',
          'peer_user_516500'

        ],
        dialogs: {
          'peer_user_77711': {
            info: construct(
              'dialog',
              {
                pinned: false,
                unread_mark: false,
                peer: construct('peerUser', {'user_id': 77711}),
                top_message: 208,
                read_inbox_max_id: 199,
                read_outbox_max_id: 14,
                unread_count: 9,
                unread_mentions_count: 0,
                notify_settings: construct('peerNotifySettings', {})
              }
            ),
            messages_order: [],
            messages: {}
          },
          'peer_user_516500': {
            info: construct(
              'dialog',
              {
                pinned: false,
                unread_mark: false,
                peer: construct('peerUser', {user_id: 516500}),
                top_message: 198,
                read_inbox_max_id: 0,
                read_outbox_max_id: 0,
                unread_count: 0,
                unread_mentions_count: 0,
                notify_settings: construct('peerNotifySettings', {})
              }
            ),
            messages_order: [],
            messages: {}
          },
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


    it('test from user to me', () => {
      const state = {
        dialogsOrder: [
          'peer_user_81118611'
        ],
        dialogs: {
          'peer_user_81118611': {
            info: construct('dialog', {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 81118611}),
              top_message: 208,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [
            ],
            messages: {
            }
          }
        }
      };

      const action = {
        type: 'ADD_MESSAGE',
        payload: construct(
          'message',
          {
            date: 1587315645,
            edit_hide: false,
            from_id: 81118611,
            from_scheduled: false,
            id: 313307,
            legacy: false,
            media_unread: false,
            mentioned: false,
            message: "321",
            out: false,
            post: false,
            silent: false,
            to_id: construct('peerUser', {user_id: 2443566})
          }
        )
      };

      const expectedState = {
        dialogsOrder: [
          'peer_user_81118611'
        ],
        dialogs: {
          'peer_user_81118611': {
            info: construct('dialog', {
              pinned: false,
              unread_mark: false,
              peer: construct('peerUser', {'user_id': 81118611}),
              top_message: 208,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [
              313307
            ],
            messages: {
              313307: construct(
                'message',
                {
                  date: 1587315645,
                  edit_hide: false,
                  from_id: 81118611,
                  from_scheduled: false,
                  id: 313307,
                  legacy: false,
                  media_unread: false,
                  mentioned: false,
                  message: "321",
                  out: false,
                  post: false,
                  silent: false,
                  to_id: construct('peerUser', {user_id: 81118611})
                }
              )
            }
          }
        }
      };

      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe('ADD_MESSAGES_BATCH', () => {
    it('test', () => {
      const state = {
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
      };
      const action = {
        type: ADD_MESSAGES_BATCH,
        payload: [
          construct(
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
          ),
          construct(
            'message',
            {
              date: 1587231833,
              edit_hide: false,
              from_id: 2443566,
              from_scheduled: false,
              id: 313179,
              legacy: false,
              media_unread: false,
              mentioned: false,
              message: "И не поспоришь",
              out: true,
              post: false,
              silent: false,
              to_id: construct('peerUser', {'user_id': 516572})
            }
          )
        ]
      };

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
            messages_order: [
              313179
            ],
            messages: {
              313179: construct(
                'message',
                {
                  date: 1587231833,
                  edit_hide: false,
                  from_id: 2443566,
                  from_scheduled: false,
                  id: 313179,
                  legacy: false,
                  media_unread: false,
                  mentioned: false,
                  message: "И не поспоришь",
                  out: true,
                  post: false,
                  silent: false,
                  to_id: construct('peerUser', {'user_id': 516572})
                }
              )
            }
          }
        }
      });
    });
  });

  describe('SET_ACTIVE_DIALOG', () => {
    test('SET', () => {
      const state = {};

      const action = {
        type: SET_ACTIVE_DIALOG,
        payload: 'dialog_id'
      };

      expect(reducer(state, action)).toEqual({activeDialog: 'dialog_id'});
    });
  });
});

