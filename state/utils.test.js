import {peerToPeerId, peerIdToPeer} from './utils.js';

const {construct} = zagram;

describe('utils', () => {
  describe('peerToPeerId', () => {
    it('peerUser', () => {
      expect(peerToPeerId(construct('peerUser', {user_id: 12}))).toEqual('peer_user_12');
    });

    it('peerChat', () => {
      expect(peerToPeerId(construct('peerChat', {chat_id: 14}))).toEqual('peer_chat_14');
    });

    it('peerChannel', () => {
      expect(peerToPeerId(construct('peerChannel', {channel_id: 42}))).toEqual('peer_channel_42');
    });
  });

  describe('peerIdToPeer', () => {
    it('peerUser', () => {
      expect(peerIdToPeer('peer_user_12')).toMatchObject(construct('peerUser', {user_id: 12}));
    });

    it('peerChat', () => {
      expect(peerIdToPeer('peer_chat_14')).toMatchObject(construct('peerChat', {chat_id: 14}));
    });

    it('peerChannel', () => {
      expect(peerIdToPeer('peer_channel_42')).toMatchObject(construct('peerChannel', {channel_id: 42}));
    });
  });
});
