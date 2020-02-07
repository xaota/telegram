import { Airgram } from 'tdweb-airgram'; // Auth

const airgram = new Airgram({
  apiId: 262680, // process.env.APP_ID as number | undefined,
  apiHash: '177a6b76ea819a88e35525aa0692e850', // process.env.APP_HASH,
  // command: process.env.TDLIB_COMMAND,
  logVerbosityLevel: 2
})

// airgram.use(new Auth({
//   code: () => '111111', // prompt(`Please enter the secret code:\n`),
//   phoneNumber: () => '+79610433909' //prompt(`Please enter your phone number:\n`)
// }))

void (async () => {
  const me = await airgram.api.getMe();
  console.log(`[Me] `, me)
})

// Getting all updates
airgram.use((ctx, next) => {
  if ('update' in ctx) {
    console.log(`[all updates][${ctx._}]`, JSON.stringify(ctx.update))
  }
  return next()
})

// Getting new messages
airgram.on('updateNewMessage', async ({ update }) => {
  const { message } = update
  console.log('[new message]', message)
})
