import telegram from '../../tdweb/Telegram.js';
const getFile = async (id) => {
    if (!id) {
        return;
    }
    // когда-то ведь надо загрузить файл
    // const res = await telegram.api('downloadFile', {
    //         file_id: id,
    //         priority: 32
    // });
    const file = await telegram.api('readFile', {
        file_id: +id,
    });
    const blob = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.data);
        reader.onloadend = function() {
            const base64data = reader.result;
            resolve(base64data);
        }
    });
    return blob;
};

export default {
    getFile,
}
//
// setTimeout(async () => {
//     const file = await telegram.api('readFile', {
//         file_id: 171,
//     });
//     console.log(file);
//     const reader = new FileReader();
//     reader.readAsDataURL(file.blob);
//     reader.onloadend = function() {
//         const base64data = reader.result;
//         console.log(base64data);
//     }
// }, 5000);
