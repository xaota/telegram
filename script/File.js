import {channel} from './DOM.js';

export default class File {
    async getFile(file) {
        if (!file.id) return;
        if (file.local.is_downloading_completed) return this.readFile(id);

        return new Promise(resolve => { // сначала подпишемся
            channel.on('updateFile', (loadFile) => {
                if (loadFile.id === file.id && loadFile.local.is_downloading_completed) {
                    this.readFile(loadFile.id)
                        .then(blob => resolve(blob));
                }
            });
            telegram.api('downloadFile', {
                file_id: file.id,
                priority: 32
            });
        });
    }

    async readFile(file_id) {
        const file = await telegram.api('readFile', {file_id});
        const blob = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.data);
            reader.onloadend = function() {
                const base64data = reader.result;
                resolve(base64data);
            }
        });
        return blob;
    }

    update(e) {
        channel.send('updateFile', e.file);
    }
}

export default new File();
