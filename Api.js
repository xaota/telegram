class Api {
    constructor(config, mtProto, CryptoWorker) {
        this.config = config;
        this.mtProto = mtProto;
        this.CryptoWorker = CryptoWorker;
    }

    sendCode(phone) {
        return this.mtProto('auth.sendCode', {
            phone_number: phone,
            current_number: false,
            api_id: this.config.id,
            api_hash: this.config.hash
        });
    }

    signIn(code, phone, phone_code_hash) {
        return this.mtProto('auth.signIn', {
            phone_number: phone,
            phone_code_hash: phone_code_hash,
            phone_code: code
        });
    }

    signUp(phone, phone_code_hash, first_name, last_name) {
        return this.mtProto('auth.signUp', {
            phone_number: phone,
            phone_code_hash: phone_code_hash,
            first_name: first_name,
            last_name: last_name
        });
    }

    getPassword() {
        return this.mtProto('account.getPassword', {})
    }

    checkPassword(current_salt /* Uint8Array */, password /* string */) {
        const pwd = new TextEncoder().encode(password);

        const final = new Uint8Array(current_salt.length * 2 + pwd.length);
        final.set(current_salt, 0);
        final.set(pwd, current_salt.length);
        final.set(current_salt, current_salt.length + pwd.length);

        return this.CryptoWorker.sha256Hash(final).then(hash => {
                return this.mtProto('auth.checkPassword', {
                    password_hash: hash
                })
            }
        );
    }

    setUserPic(bytes) {
        return new Promise((resolve, reject) => {
            reject('todo');
        });
    }

    getDialogs(offset_date, limit) {
        return this.mtProto('messages.getDialogs', {
            offset_date: offset_date,
            limit: limit
        });
    }

    getHistory(peerId, peerType, accessHash, offset_id, limit) {
        let peer;
        switch (peerType) {
            case 'user':
                peer = {
                    _: 'inputPeerUser',
                    user_id: peerId,
                    access_hash: accessHash
                };
                break;
            case 'channel':
                peer = {
                    _: 'inputPeerChannel',
                    channel_id: peerId,
                    access_hash: accessHash
                };
                break;
            case 'chat':
                peer = {
                    _: 'inputPeerChat',
                    chat_id: peerId,
                    access_hash: accessHash
                };
                break;
        }

        return this.mtProto('messages.getHistory', {
            peer: peer,
            offset_id: offset_id,
            limit: limit
        });
    }

    getFile(location) {
        return this.mtProto(
            'upload.getFile',
            {
                location: {
                    _: 'inputFileLocation',
                    volume_id: location.volume_id,
                    local_id: location.local_id,
                    secret: location.secret,
                },
                flags: 0,
                precise: false,
                offset: 0,
                limit: 1024 * 1024,
            },
            {
                dcID: location.dc_id,
                createNetworker: true,
                fileDownload: true,
            }
        );
    }

    getDocumentFile(location) {
        return this.mtProto(
            'upload.getFile',
            {
                location: {
                    _: 'inputDocumentFileLocation',
                    id: location.id,
                    access_hash: location.access_hash
                },
                flags: 0,
                precise: false,
                offset: 0,
                limit: 1024 * 1024,
            },
            {
                dcID: location.dc_id,
                createNetworker: true,
                fileDownload: true,
            }
        );
    }

    getConfig() {
        return this.mtProto('help.getConfig', {});
    }
}