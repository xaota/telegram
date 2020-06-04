import {
  buildMessageFromUpdateShortMessage,
  buildMessageFromUpdateShortChatMessage
} from './telegramUpdateMiddleware.js';

const {construct} = zagram;

describe('telegramUpdateMiddleware', () => {
  describe('buildMessageFromUpdateShortMessage', () => {
    it('income message', () => {
      const message = construct('updateShortMessage', {
        date: 1588399072,
        id: 315770,
        media_unread: false,
        mentioned: false,
        message: "Сашка писька",
        out: false,
        pts: 582455,
        pts_count: 1,
        silent: false,
        user_id: 81118611
      });

      expect(buildMessageFromUpdateShortMessage([message, 2443566])).toEqual(construct(
       'message',
        {
          date: 1588399072,
          id: 315770,
          media_unread: false,
          mentioned: false,
          message: "Сашка писька",
          out: false,
          silent: false,
          from_id: 81118611,
          to_id: construct('peerUser', {'user_id': 2443566})
        }
      ));
    });

    it('out message', () => {
      const message = construct('updateShortMessage', {
        date: 1588399072,
        id: 315770,
        media_unread: false,
        mentioned: false,
        message: "Сашка писька",
        out: true,
        pts: 582455,
        pts_count: 1,
        silent: false,
        user_id: 81118611
      });

      expect(buildMessageFromUpdateShortMessage([message, 2443566])).toEqual(construct(
        'message',
        {
          date: 1588399072,
          id: 315770,
          media_unread: false,
          mentioned: false,
          message: "Сашка писька",
          out: true,
          silent: false,
          from_id: 2443566,
          to_id: construct('peerUser', {'user_id': 81118611})
        }
      ));
    });
  });

  describe('buildMessageFromUpdateShortChatMessage', () => {
    const update = construct(
      'updateShortChatMessage',
      {
        chat_id: 467130648,
        date: 1588400623,
        from_id: 2443566,
        id: 315776,
        media_unread: false,
        mentioned: false,
        message: "конечно голодом их мучают",
        out: true,
        pts: 582466,
        pts_count: 1,
        silent: false
      }
    );

    expect(buildMessageFromUpdateShortChatMessage(update)).toEqual(construct(
      'message',
      {
        date: 1588400623,
        from_id: 2443566,
        id: 315776,
        media_unread: false,
        mentioned: false,
        message: "конечно голодом их мучают",
        out: true,
        pts: 582466,
        pts_count: 1,
        silent: false,
        to_id: construct('peerChat', {chat_id: 467130648})
      }
    ));
  });
});
