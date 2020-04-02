import {channel} from './DOM.js';
import telegram from '../tdweb/Telegram.js';

export class File {
  static async stopLoading(fileId) {
    await telegram.api('cancelDownloadFile', {file_id: fileId});
  }

  getFile(file, getFileState, loadingProcess, priority = 32) {
    return new Promise((resolve, reject) => {
      if (!file || !file.id) return reject(new Error('no file id'));
      if (file.local.is_downloading_completed) {
        return this.readFile(file.id).then(blob => resolve(blob));
      }

      channel.on('updateFile', loadFile => { // @todo: вынести в синглколл/отписаться / подписка на загрузку файла
        if (file.local.is_downloading_completed) return this.readFile(file.id);
        if (loadFile.id !== file.id) return;
        if (loadingProcess) loadingProcess(loadFile);
        // TODO: также отобразить в канале промежуточный результат загрузки
        if (loadFile.local.is_downloading_completed) {
          if (getFileState) {
            return resolve(loadFile);
          }
          return this.readFile(loadFile.id).then(blob => resolve(blob));
        } // todo: отписаться бы
      });

      telegram.api('downloadFile', {file_id: file.id, priority});
    });
  }

  static async readFile(fileId) {
    const file = await telegram.api('readFile', {file_id: fileId});

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.data); // ! с большими файлами (1+ мб) не сработает
      reader.onloadend = function() {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  static update(e) {
    channel.send('updateFile', e.file); //
  }
}

export default new File();

export function normalizeSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 KB';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
