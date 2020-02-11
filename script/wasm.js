import telegram from '../tdweb/Telegram.js';

main('./td_wasm.wasm');

async function main(path) {
  /** Create TdClient.
  * @param {Object} options - Options for TDLib instance creation.
  * @param {TdClient~updateCallback} options.onUpdate - Callback for all incoming updates.
  * @param {string} [options.instanceName=tdlib] - Name of the TDLib instance. Currently only one instance of TdClient with a given name is allowed. All but one instances with the same name will be automatically closed. Usually, the newest non-background instance is kept alive. Files will be stored in an IndexedDb table with the same name.
  * @param {boolean} [options.isBackground=false] - Pass true, if the instance is opened from the background.
  * @param {string} [options.jsLogVerbosityLevel=info] - The initial verbosity level of the JavaScript part of the code (one of 'error', 'warning', 'info', 'log', 'debug').
  * @param {number} [options.logVerbosityLevel=2] - The initial verbosity level for the TDLib internal logging (0-1023).
  * @param {boolean} [options.useDatabase=true] - Pass false to use TDLib without database and secret chats. It will significantly improve loading time, but some functionality will be unavailable.
  * @param {boolean} [options.readOnly=false] - For debug only. Pass true to open TDLib database in read-only mode
  * @param {string} [options.mode=auto] - For debug only. The type of the TDLib build to use. 'asmjs' for asm.js and 'wasm' for WebAssembly. If mode == 'auto' WebAbassembly will be used if supported by browser, asm.js otherwise.
  */

//   const TdClient = window.tdweb.default;
//   const client = new TdClient({prefix: 'tdlib_test'});
//   console.log(client);
//   client.onUpdate = update => {
//     // if (!this.disableLog) {
//         if (update['@type'] === 'updateFile') {
//             console.log('receive updateFile file_id=' + update.file.id, update);
//         } else {
//             console.log('receive update', update);
//         }
//     // this.emit('update', update);
// };
  // const m = await import('../tdweb/tdweb.js');
  // console.log(m);

  // const response = await fetch(");
  // const buffer = await response.arrayBuffer();
  // const td_wasm = await WebAssembly.compile(buffer);

  // const response = await fetch(path);
  // const bits = await response.arrayBuffer();
  // const module = await WebAssembly.compile(bits);
  // // const instance = await WebAssembly.instantiate(buffer);
  // const instance = new WebAssembly.Instance(module);

  // const fetchPromise = fetch(path);
  // const instance = await WebAssembly.instantiateStreaming(fetchPromise);
  // const result = instance.exports.fibonacci(42);
  // console.log(result);
  // console.log(instance);
}
