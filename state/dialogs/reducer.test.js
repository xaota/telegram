import {
  LOAD_DIALOGS,
  DIALOGS_LOAD_FAILED,
  DIALOGS_LOADED,
  SET_ACTIVE_DIALOG,
  SET_SEARCHED_DIALOG_MESSAGES,
  CLEAR_SEARCHED_DIALOG_MESSAGES,
  PREPEND_MESSAGE,
  ADD_MESSAGES_BATCH,
  DELETE_MESSAGE
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

    it('test duplicate', () => {
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

  describe('PREPEND_MESSAGE', () => {
    it('new message', () => {
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
              top_message: 313079,
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
      };

      const action = {
        type: PREPEND_MESSAGE,
        payload: construct(
          'message',
          {
            date: 1587231833,
            edit_hide: false,
            from_id: 2443566,
            from_scheduled: false,
            id: 313080,
            legacy: false,
            media_unread: false,
            mentioned: false,
            message: "new message",
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
              top_message: 313080,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [313080, 313079],
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
              ),
              313080: construct(
                'message',
                {
                  date: 1587231833,
                  edit_hide: false,
                  from_id: 2443566,
                  from_scheduled: false,
                  id: 313080,
                  legacy: false,
                  media_unread: false,
                  mentioned: false,
                  message: "new message",
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

    it('tmp message', () => {
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
              top_message: 313079,
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
      };

      const tmpId = 2 ** 32 + 234234;

      const message = {
        id: tmpId,
        message: "Погода каеф",
        out: true,
        random_id: BigInt('16945408568127560875'),
        peer: construct('inputPeerUser', {
          user_id: 77700
        }),
        to_id: construct('peerUser', {user_id: 77700})
      };

      const action = {
        type: PREPEND_MESSAGE,
        payload: message
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
              top_message: tmpId,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [
              tmpId, 313079
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
              ),
              [tmpId]: {
                id: tmpId,
                out: true,
                message: "Погода каеф",
                random_id: BigInt('16945408568127560875'),
                peer: construct('inputPeerUser', {
                  user_id: 77700
                }),
                to_id: construct('peerUser', {user_id: 77700})
              }
            }
          }
        }
      });
    });
  });

  describe('DELETE_MESSAGE', () => {
    it('delete', () => {
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
              top_message: 313080,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [313080, 313079],
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
              ),
              313080: construct(
                'message',
                {
                  date: 1587231833,
                  edit_hide: false,
                  from_id: 2443566,
                  from_scheduled: false,
                  id: 313080,
                  legacy: false,
                  media_unread: false,
                  mentioned: false,
                  message: "new message",
                  out: true,
                  post: false,
                  silent: false,
                  to_id: construct('peerUser', {'user_id': 77700})
                }
              )
            }
          }
        }
      };

      const action = {
        type: DELETE_MESSAGE,
        payload: {
          id: 313080,
          to_id: construct('peerUser', {'user_id': 77700})
        }
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
              top_message: 313080,
              read_inbox_max_id: 199,
              read_outbox_max_id: 14,
              unread_count: 9,
              unread_mentions_count: 0,
              notify_settings: construct('peerNotifySettings', {})
            }),
            messages_order: [313079],
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


  describe('SET_SEARCHED_DIALOG_MESSAGES', () => {
    test('SET', () => {
      const state = {
        dialogsOrder: ['peer_user_77700'],
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
          }
        }
      };

      const action = {
        type: SET_SEARCHED_DIALOG_MESSAGES,
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
              to_id: construct('peerUser', {'user_id': 77700})
            }
          )
        ]
      };

      expect(reducer(state, action)).toEqual({
        dialogsOrder: ['peer_user_77700'],
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
            search_order: [313079, 313179],
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
              ),
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
                  to_id: construct('peerUser', {'user_id': 77700})
                }
              )
            }
          }
        }
      });
    });
  });

  describe('CLEAR_SEARCHED_DIALOGS_MESSAGES', () => {
    const state = {
      dialogsOrder: ['peer_user_77700'],
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
          search_order: [313079, 313179],
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
            ),
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
                to_id: construct('peerUser', {'user_id': 77700})
              }
            )
          }
        }
      }
    };

    const action = {
      type: CLEAR_SEARCHED_DIALOG_MESSAGES,
      payload: construct('peerUser', {'user_id': 77700})
    };

    expect(reducer(state, action)).toEqual({
      dialogsOrder: ['peer_user_77700'],
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
          search_order: [],
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
            ),
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
                to_id: construct('peerUser', {'user_id': 77700})
              }
            )
          }
        }
      }
    });
  });
});

