import {channel} from './DOM.js';

export class File {
  async getFile(file, priority = 32) {
    if (!file.id) return;
    if (file.local.is_downloading_completed) return this.readFile(id);

    return new Promise(resolve => { // сначала подпишемся
      channel.on('updateFile', (loadFile) => {
        if (loadFile.id !== file.id) return;
        // TODO: также отобразить в канале промежуточный результат загрузки
        if (loadFile.local.is_downloading_completed) return this.readFile(loadFile.id).then(blob => resolve(blob));
      });
      telegram.api('downloadFile', {file_id: file.id, priority});
    });
  }

  async readFile(file_id) {
    const file = await telegram.api('readFile', {file_id});

    const blob = await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.data); // с большими файлами не сработает
      reader.onloadend = function() {
        const base64data = reader.result;
        resolve(base64data);
      }
    });
    return blob;
  }

  update(e) {
    channel.send('updateFile', e.file); //
  }
}

export default new File();
