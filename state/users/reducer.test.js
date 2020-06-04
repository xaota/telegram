import reducer from './reducer.js';
import {SET_USER, SET_USER_LIST, SET_USER_FULL} from './constants.js';

const {construct} = zagram;

describe('users reducer', () => {
  describe('SET_USER', () => {
    it('new_user', () => {
      const action = {
        type: SET_USER,
        payload: construct(
          'user',
          {
            selft: true,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 489174,
            access_hash: BigInt('11258878342961665336'),
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            phone: '9996621111',
            status: construct('userStatusOnline', {expires: 1585773114})
          }
        )
      };

      expect(reducer({}, action)).toEqual({
        489174: {
          base: construct(
            'user',
            {
              selft: true,
              contact: false,
              mutual_contact: false,
              deleted: false,
              bot: false,
              bot_chat_history: false,
              bot_nochats: false,
              verified: false,
              restricted: false,
              min: false,
              bot_inline_geo: false,
              support: false,
              scam: false,
              id: 489174,
              access_hash: BigInt('11258878342961665336'),
              first_name: 'John',
              last_name: 'Doe',
              username: 'johndoe',
              phone: '9996621111',
              status: construct('userStatusOnline', {expires: 1585773114})
            }
          )
        }
      });
    });
  });

  test('SET_USER_LIST', () => {
    const action = {
      type: SET_USER_LIST,
      payload: [
        construct(
          'user',
          {
            selft: true,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 489174,
            access_hash: BigInt('11258878342961665336'),
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            phone: '9996621111',
            status: construct('userStatusOnline', {expires: 1585773114})
          }
        ),
        construct(
          'user',
          {
            self: false,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 516572,
            access_hash: BigInt('361006919551893588'),
            first_name: 'Ivan',
            username: 'test9996627777',
            status: construct('userStatusOffline', {was_online: 1585649788})
          }
        )
      ]
    };

    expect(reducer({}, action)).toEqual({
      489174: {
        base: construct(
          'user',
          {
            selft: true,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 489174,
            access_hash: BigInt('11258878342961665336'),
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            phone: '9996621111',
            status: construct('userStatusOnline', {expires: 1585773114})
          }

        )
      },
      516572: {
        base: construct(
          'user',
          {
            self: false,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 516572,
            access_hash: BigInt('361006919551893588'),
            first_name: 'Ivan',
            username: 'test9996627777',
            status: construct('userStatusOffline', {was_online: 1585649788})
          }
        )
      }
    });
  });

  test('SET_FULL_USER', () => {
    const state = {
      489174: {
        base: construct(
          'user',
          {
            selft: true,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 489174,
            access_hash: BigInt('11258878342961665336'),
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            phone: '9996621111',
            status: construct('userStatusOnline', {expires: 1585773114})
          }
        )
      }
    };

    const action = {
      type: SET_USER_FULL,
      payload: construct(
        'userFull',
        {
          blocked: false,
          can_pin_message: false,
          common_chats_count: 15,
          has_scheduled: false,
          notify_settings: construct('peerNotifySettings'),
          user: construct(
            'user',
            {
              selft: true,
              contact: false,
              mutual_contact: false,
              deleted: false,
              bot: false,
              bot_chat_history: false,
              bot_nochats: false,
              verified: false,
              restricted: false,
              min: false,
              bot_inline_geo: false,
              support: false,
              scam: false,
              id: 489174,
              access_hash: BigInt('11258878342961665336'),
              first_name: 'John',
              last_name: 'Doe',
              username: 'johndoe',
              phone: '9996621111',
              status: construct('userStatusOnline', {expires: 1585773114})
            }
          ),
          settings: construct(
            'peerSettings',
            {
              add_contact: false,
              block_contact: false,
              need_contacts_exception: false,
              report_geo: false,
              report_spam: false,
              share_contact: false
            }
          )
        }
      )
    };

    expect(reducer(state, action)).toEqual({
      489174: {
        base: construct(
          'user',
          {
            selft: true,
            contact: false,
            mutual_contact: false,
            deleted: false,
            bot: false,
            bot_chat_history: false,
            bot_nochats: false,
            verified: false,
            restricted: false,
            min: false,
            bot_inline_geo: false,
            support: false,
            scam: false,
            id: 489174,
            access_hash: BigInt('11258878342961665336'),
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            phone: '9996621111',
            status: construct('userStatusOnline', {expires: 1585773114})
          }
        ),
        full: construct(
          'userFull',
          {
            blocked: false,
            can_pin_message: false,
            common_chats_count: 15,
            has_scheduled: false,
            notify_settings: construct('peerNotifySettings'),
            user: construct(
              'user',
              {
                selft: true,
                contact: false,
                mutual_contact: false,
                deleted: false,
                bot: false,
                bot_chat_history: false,
                bot_nochats: false,
                verified: false,
                restricted: false,
                min: false,
                bot_inline_geo: false,
                support: false,
                scam: false,
                id: 489174,
                access_hash: BigInt('11258878342961665336'),
                first_name: 'John',
                last_name: 'Doe',
                username: 'johndoe',
                phone: '9996621111',
                status: construct('userStatusOnline', {expires: 1585773114})
              }
            ),
            settings: construct(
              'peerSettings',
              {
                add_contact: false,
                block_contact: false,
                need_contacts_exception: false,
                report_geo: false,
                report_spam: false,
                share_contact: false
              }
            )
          }
        )
      }
    });
  });
});
