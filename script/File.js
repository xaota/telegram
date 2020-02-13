import {channel} from './DOM.js';

export class File {
  async getFile(file, priority = 32) {
    return new Promise((resolve, reject) => {
      if (!file || !file.id) return reject(new Error('no file id'));
      if (file.local.is_downloading_completed) {
        return this.readFile(file.id).then(blob => resolve(blob));
      }

      channel.on('updateFile', (loadFile) => { // @todo: вынести в синглколл/отписаться / подписка на загрузку файла
        if (file.local.is_downloading_completed) return this.readFile(file.id);
        if (loadFile.id !== file.id) return;
        // TODO: также отобразить в канале промежуточный результат загрузки
        if (loadFile.local.is_downloading_completed) return this.readFile(loadFile.id).then(blob => resolve(blob)); // todo: отписаться бы
      });

      telegram.api('downloadFile', {file_id: file.id, priority});
    });
  }

  async readFile(file_id) {
    const file = await telegram.api('readFile', {file_id});

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.data); // ! с большими файлами (1+ мб) не сработает
      reader.onloadend = function() {
        const base64data = reader.result;
        resolve(base64data);
      }
    });
  }

  update(e) {
    channel.send('updateFile', e.file); //
  }
}

export default new File();
