import AppStorage from './script/Storage.js/index.js';
// in window: mtproto.MTProto, vendor, bundle/hash.worker?

const phone = {
  num: '+79610433909', // '+79297544725',
  code: '22222'
}

const api = {
  layer: 57,
  // invokeWithLayer: 0xda9b0d0d,
  initConnection: 0x69796de9,
  api_id: 905423 // 49631
}

const server = {
  webogram: true,
  dev: true // true //We will connect to the test server.
}           //Any empty configurations fields can just not be specified

const storage = new AppStorage();
// const defaultDC = 2;

// console.log(lib);

// debugger;

console.log('mtproto', mtproto);
const app = {storage};
const client = mtproto.MTProto({server, api, app});
// const client = window.mtproto({ server, api })

// const mtProto = lib.MTProto({
//   server: {
//       dev: true, // false,
//       // webogram: true
//   },
//   api: {
//       layer: 57,
//       initConnection: 0x69796de9,
//       api_id: 49631 // config.id
//   } //,
//   // app: {
//   //     storage: storage
//   // }
// });

const toBytes = u => new TextDecoder().decode(u);
// const fromBytes =new TextEncoder("utf-8").encode("Plain Text");

console.log('client', client);
storage.get('dc2_auth_key')
  .then(async e => {
    if (e) {
      console.log('auth', e);
      // const temp3 = {
      //   id: await storage.get('auth.exportedAuthorization.id'),
      //   bytes: await storage.get('auth.exportedAuthorization.bytes')
      // };
      // temp3.id = parseInt(temp3.id);
      // temp3.bytes = temp3.bytes.split(',').map(e => parseInt(e));
      // temp3.bytes = new Uint8Array(temp3.bytes).buffer;
      // temp3.bytes = fromByteArray(temp3.bytes)
      // temp3.bytes = Array.from(temp3.bytes);
      // temp3.bytes = btoa(String.fromCharCode.apply(null, temp3.bytes)) // .replace(/=/g, '');
      // temp3.bytes = decodeURIComponent(escape(String.fromCharCode.apply(null, temp3.bytes))) // .replace(/=/g, '');
      // temp3.bytes = {_: 'bytes', bytes: temp3.bytes}

      // atob("wxhgcv1MNBClpjKdO9IHcWM8SrsLAoZL7/nOt3WyYiwh11GP7ZGPWLJRZWIi58sQf1Bfm7hHGJtm8sXNd3KuykwJsY/keFCxvIwy9b0/hjk2htnjC8UOHf9+1730F0X3JJp1u+Zrt+76z5Pp4Zmkhfw57sfX18rVNxR/Fv4jVGQ=").split('').map(c => c.charCodeAt(0))

      const {nearest_dc} = await client('help.getNearestDc');
      // const temp4 = await client('auth.exportAuthorization', {dc_id: nearest_dc});
      // console.log('t4', temp4);

      // console.log('auth.import', temp3);
      // await client("auth.importAuthorization", temp3);
      console.log('set init');
      init(); // await storage.get('access_hash')
    } else {
      console.log('not auth');
      // const {nearest_dc} = await client('help.getNearestDc');
      // console.log('nearest_dc', nearest_dc);
      // debugger;
      // storage.set('nearest_dc', nearest_dc);
      const access_hash = await connect();
      init(access_hash);
    }
  })
// await connect()
// init();

async function init(access_hash) {
  const temp = await client('messages.getDialogs', {
    offset_date: 0, //offset_date,
    limit: 20 // limit
    // access_hash
  });
  console.log('d', temp);
}

async function connect() {
  const temp0 = await client('auth.sendCode', {
    phone_number: phone.num,
    current_number: false,
    api_id: 905423, // 49631, // 262680,
    api_hash: '3beebd95a9a78b35f4dc296fa1b7d8fd' // 'fb050b8f6771e15bfda5df2409931569' // '177a6b76ea819a88e35525aa0692e850'
  });
  const phone_code_hash = temp0.phone_code_hash;
  console.log('phone_code_hash', temp0);
  // Error 401 AUTH_KEY_UNREGISTERED
  // Error 420 FLOOD_WAIT_82761 2 2

  const temp1 = await client('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash: phone_code_hash,
    phone_code: prompt('код'), // phone.code
    // first_name: 'xaota',
    // last_name: ''
  });
  // Error 400 PHONE_CODE_INVALID 2 2
  // Error 400 PHONE_NUMBER_UNOCCUPIED 2 2
  const user = temp1.user;
  console.log('signed as ', temp1);

  if (user._ === 'user') {
    // storage.set('auth', 1);
    // storage.set('user', user.id);
    // storage.set('access_hash', user.access_hash);
    // storage.set('phone_code_hash', phone_code_hash);
    // storage.set('api_id', 905423);
    // storage.set('api_hash', '3beebd95a9a78b35f4dc296fa1b7d8fd');
  }

  // const nearest_dc = await storage.get('nearest_dc');
  // const temp2 = await client('auth.exportAuthorization', {dc_id: nearest_dc});
  // console.log('t2', temp2);
  // debugger;
  // storage.set('auth.exportedAuthorization.id', temp2.id);
  // storage.set('auth.exportedAuthorization.bytes', temp2.bytes);
  // console.log('t2+');
  // await client("auth.importAuthorization", {id: temp2.id, bytes: temp2.bytes});

  return user.access_hash;
}

// connect()

// });


const temp = {
  "_": "user",
  "flags": 7295,
  "self": true,
  "contact": true,
  "mutual_contact": true,
  "id": 304888926,
  "access_hash": "12795066928584456303",
  "first_name": "Ринат",
  "last_name": "Ибрагимов",
  "username": "rinatibragimov",
  "phone": "79297544725",
  "photo": {
    "_": "userProfilePhoto",
    "photo_id": "1309487966538803133",
    "photo_small": {
      "_": "fileLocation",
      "dc_id": 2,
      "volume_id": "257717448",
      "local_id": 172340,
      "secret": "10475336094687393290"
    },
    "photo_big": {
      "_": "fileLocation",
      "dc_id": 2,
      "volume_id": "257717448",
      "local_id": 172342,
      "secret": "7119520049407881657"
    }
  }, "status": {
    "_": "userStatusOffline",
    "was_online": 1580793478
  }
}
