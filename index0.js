const Client = require('tdl').Client;
const TDLib = require('tdl-tdlib-wasm').TDLib;

main();

function createClient (options) {
  return new Promise(resolve => {
    Module().then(module => {
      const tdlib = new TDLib(module)
      resolve(new Client(tdlib, options))
    })
  })
}

async function main () {
  const client = await createClient({
    apiId: 262680,
    apiHash: '177a6b76ea819a88e35525aa0692e850', // Your api_hash
    useDefaultVerbosityLevel: true
  })

  console.log(client)

  await client.connectAndLogin(() => ({
    getPhoneNumber: retry => Promise.resolve('+79610433909'),
    getAuthCode: retry => Promise.resolve('111111'),
    getPassword: (passwordHint, retry) => Promise.resolve(true),
    getName: () => {
      throw new Error('not supported')
    }
  }))

  const result = await client.invoke({
    _: 'getChats',
    offset_order: '9223372036854775807',
    offset_chat_id: 0,
    limit: 100
  })

  // latest 100 chats will be returned
  console.log('RESULT', result)
}
