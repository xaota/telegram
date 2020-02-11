const API = require('./api');

class MTProto {
  constructor({ api_id, api_hash, test = false, https = false }) {
    this.api = new API({ api_id, api_hash, test, https });
  }

  sendCode(phoneNumber) {
    this.phoneNumber = phoneNumber;
    return this.api
        .call('auth.sendCode', {
          flags: 0,
          phone_number: phoneNumber,
        })
        .then((res) => {
          this.phone_code_hash = res.this.phone_code_hash;
        });
  }
  signIn(code) {
    return this.api
        .call('auth.signIn', {
          phone_code: code,
          phone_number: this.phoneNumber,
          phone_code_hash: this.phone_code_hash,
        })
        .then(res => res.user);
  }
  getDialogs({offsetDate, limit}) {
  return this.api
      .call('messages.getDialogs', {
          flags: 0,
          offset_date: offsetDate,
          offset_peer: { _: 'inputPeerEmpty' },
          limit: 20,
      })
      .then(res => res);
  }
}

window.mtproto  = new MTProto({api_id: 262680, api_hash: '177a6b76ea819a88e35525aa0692e850', test: true});

module.exports = MTProto;
