class Controller {
    constructor(view, api, storage) {
        this.view = view;
        this.api = api;
        this.storage = storage;
        this.fileManager = new FileManager(api);

        this.state = {
            im: {},
            dialogs: [],
            users: {},
            chats: {},
            messages: {}
        };

        view.login.onLogin = (phone, keepSigned) => {
            this.storage.inMemory = !keepSigned;

            api.sendCode(phone)
                .then(result => {
                    this.state.im.phone = phone;
                    this.state.im.phone_code_hash = result.phone_code_hash;
                    $('#enterCode_phone').innerText = phone;
                    view.showScreen('enterCode');
                    $('#login_button').classList.remove('loading');
                })
                .catch(e => {
                    console.error(e);
                });
        };

        view.enterCode.onCode = code => {
            api.signIn(code, this.state.im.phone, this.state.im.phone_code_hash)
                .then(
                    data => {
                        if (data._ === 'auth.authorizationSignUpRequired') {
                            view.showScreen('enterName');
                        } else {
                            // data._ = 'user'
                            // storage.set('uid', )
                            storage.set('auth', 1);
                            this.showMain();
                        }
                    },
                    e => {
                        if (e.type === 'PHONE_NUMBER_UNOCCUPIED') {
                            view.showScreen('enterName');
                        } else if (e.type === 'SESSION_PASSWORD_NEEDED') {
                            view.showScreen('enterPassword');
                        } else {
                            console.error(e);
                            view.enterCode.showError();
                        }
                    }
                )
                .catch(e => {
                    console.error(e);
                });
        };

        view.enterPassword.onPassword = password => {
            api.getPassword()
                .then(
                    pwd => {
                        api.checkPassword(pwd.current_salt, password)
                            .then(
                                r => {
                                    storage.set('auth', 1);
                                    this.showMain();
                                },
                                e => {
                                    view.enterPassword.showError();
                                }
                            )
                    },
                    e => {
                        console.log(e);
                    }
                );
        };

        view.enterName.onName = data => {
            api.signUp(this.state.im.phone, this.state.im.phone_code_hash, data.firstName, data.lastName)
                .then(
                    () => {
                        storage.set('auth', 1);
                        this.showMain();
                    },
                    e => {
                        console.error(e);
                    }
                )
                .catch(e => {
                    console.error(e);
                });
        };

        storage.get('auth')
            .then(isAuth => {
                if (isAuth == 1) {
                    this.showMain();
                } else {
                    this.showLogin();
                }
            })
            .catch(e => {
                this.showLogin();
            });
    }

    showLogin() {
        this.storage.clear();
        this.view.showScreen('login');
    };

    showMain() {
        this.currentDialog = null;
        this.currentPeer = null;
        this.dialogsLoading = false;
        this.historyLoading = false;

        this.view.dialogsList.onScrollBottom = () => {
            this.getMoreDialogs();
        };
        this.getMoreDialogs();

        this.view.dialogsList.onDialogSelect = (id, type) => {
            this.selectDialog(id, type);
        };
        this.view.messagesList.onScrollTop = () => {
            this.getMoreHistory();
        };

        this.view.showMain();
    }

    selectDialog(id, type) {
        const getDialogByPeer = (id, type) => {
            for (let d of this.state.dialogs) {
                if (type === 'channel') {
                    if (d.peer.channel_id === id) return d;
                } else if (type === 'chat') {
                    if (d.peer.chat_id === id) return d;
                } else if (type === 'user') {
                    if (d.peer.user_id === id) return d;
                }
            }
        };

        this.currentDialog = getDialogByPeer(id, type);

        setBg($('#chatHeader .header-avatar'), '');
        if (type === 'user') {
            const user = this.state.users[id];
            if (user.photo && user.photo.photo_small) {
                this.fileManager.getFile(user.photo.photo_small).then(url => {
                    setBg($('#chatHeader .header-avatar'), url);
                }).catch(e => console.error(e));
            }
            $('#chatHeader .header-title').innerText = formatName(user);
            $('#chatHeader .header-text').innerText = '';
            this.currentPeer = user;
        } else if (type === 'channel') {
            const chat = this.state.chats[id];
            if (chat.photo && chat.photo.photo_small) {
                this.fileManager.getFile(chat.photo.photo_small).then(url => {
                    setBg($('#chatHeader .header-avatar'), url);
                }).catch(e => console.error(e));
            }
            toggleClass($('#messagesList'), 'megagroup', chat.megagroup);
            $('#chatHeader .header-title').innerText = chat.title;
            $('#chatHeader .header-text').innerText = '';
            this.currentPeer = chat;
        } else if (type === 'chat') {
            const chat = this.state.chats[id];
            if (chat.photo && chat.photo.photo_small) {
                this.fileManager.getFile(chat.photo.photo_small).then(url => {
                    setBg($('#chatHeader .header-avatar'), url);
                }).catch(e => console.error(e));
            }
            toggleClass($('#messagesList'), 'megagroup', true);
            $('#chatHeader .header-title').innerText = chat.title;
            $('#chatHeader .header-text').innerText = '';
            this.currentPeer = chat;
        }

        this.view.messagesList.clear();
        toggle($('#chatHeader'), false);
        toggle($('#middleLoading'), true);
        this.getMoreHistory(true);
    }

    getMoreHistory(first) {
        if (this.historyLoading) return;

        this.historyLoading = true;
        this.api.getHistory(this.currentPeer.id, this.currentPeer._, this.currentPeer.access_hash, this.view.messagesList.minMessageId, 20)
            .then(
                data => {
                    this.historyLoading = false;
                    toggle($('#chatHeader'), true, 'flex');
                    toggle($('#middleLoading'), false);

                    console.log(data);
                    data.users.forEach(u => {
                        this.state.users[u.id] = u;
                        if (u.self) {
                            this.state.im.user = u
                        }
                    });
                    data.messages.forEach(msg => {
                        msg.isMy = msg.from_id === this.state.im.user.id;
                        msg.peerType = this.currentPeer._;
                        msg.checksCount = getChecksCount(msg, this.currentDialog);
                    });
                    this.view.messagesList.prependMessages(data, first);
                },
                e => {
                    this.historyLoading = false;
                    console.error(e);
                }
            )
    }

    getMoreDialogs() {
        if (this.dialogsLoading) return;

        const topMessage = this.state.dialogs.length > 0 ? this.state.dialogs[this.state.dialogs.length - 1].top_message : -1;
        const msg = this.state.messages[topMessage];
        const offsetDate = msg ? msg.date : 0;
        this.dialogsLoading = true;
        this.api.getDialogs(offsetDate, 20)
            .then(
                data => {
                    this.dialogsLoading = false;
                    console.log(data);
                    data.users.forEach(u => {
                        this.state.users[u.id] = u;
                        if (u.self) {
                            this.state.im.user = u
                        }
                    });
                    data.dialogs.forEach(d => {
                        if (d.peer.user_id === this.state.im.user.id) {
                            d.isMy = true;
                        }
                    });
                    this.state.dialogs = this.state.dialogs.concat(data.dialogs);
                    data.chats.forEach(u => {
                        this.state.chats[u.id] = u;
                    });
                    data.messages.forEach(msg => {
                        msg.isMy = msg.from_id === telegram.state.im.user.id;
                        this.state.messages[msg.id] = msg;
                    });
                    this.view.dialogsList.appendData(data.dialogs)
                },
                e => {
                    this.dialogsLoading = false;
                    if (e.code === 401) {
                        this.showLogin();
                    }
                }
            );
    }

}
