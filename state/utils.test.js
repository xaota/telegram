import {peerToPeerId, peerIdToPeer} from './utils.js';
import {inputPeerToPeerId} from './utils';

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

  describe('inputPeerToPeerId', () => {
    it('inputPeerUser', () => {
      expect(inputPeerToPeerId(construct('inputPeerUser', {user_id: 12}))).toEqual('peer_user_12');
    });

    it('inputPeerChat', () => {
      expect(inputPeerToPeerId(construct('inputPeerChat', {chat_id: 14}))).toEqual('peer_chat_14');
    });

    it('inputPeerChannel', () => {
      expect(inputPeerToPeerId(construct(
        'inputPeerChannel',
        {
          channel_id: 42,
          access_hash: BigInt('123')
        }
      ))).toEqual('peer_channel_42');
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
