const {
  mergeAllArrayBuffers,
  uint8ToBigInt,
  mergeArrayBuffer,
  uint8ToArrayBuffer,
  bigIntToUint8Array,
  powModulo,
  construct
} = zagram;

const bigIntToArrayBuffer = R.pipe(
  bigIntToUint8Array,
  uint8ToArrayBuffer
);

const arrayBufferToBigInt = R.pipe(
  x => new Uint8Array(x),
  uint8ToBigInt
);

/**
 * @param {ArrayBuffer} a
 * @param {ArrayBuffer} b
 * @return {ArrayBuffer}
 */
function xor(a, b) {
  const result = new ArrayBuffer(a.byteLength);
  const view = new Uint8Array(result);
  const viewA = new Uint8Array(a);
  const viewB = new Uint8Array(b);

  for (let i=0; i < a.byteLength; i += 1) {
    view[i] = viewA[i] ^ viewB[i]; // eslint-disable-line
  }

  return result;
}

export function getRandomBigInt(bytesCount) {
  const array = new Uint8Array(bytesCount);
  window.crypto.getRandomValues(array);
  return uint8ToBigInt(array);
}

/**
 * @param buffer
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function sha256(buffer) {
  return window.crypto.subtle.digest('SHA-256', buffer);
}

/**
 * @param buffer
 * @param salt
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function pbkdf2(buffer, salt) {
  return window.crypto.subtle
    .importKey(
      'raw',
      buffer,
      'PBKDF2',
      false,
      ['deriveBits']
    )
    .then(key => window.crypto.subtle
      .deriveBits(
        {
          salt,
          name: 'PBKDF2',
          hash: 'SHA-512',
          iterations: 100000
        },
        key,
        512
      ));
}
window.pbkdf2 = pbkdf2;

/**
 * @param buffer
 * @returns {PromiseLike<ArrayBuffer>}
 */
export const H = sha256;

/**
 * @param data
 * @param salt
 * @return {PromiseLike<ArrayBuffer>}
 */
export const SH = R.unapply(R.pipe(
  R.of,
  R.ap([
    R.nth(1),
    R.nth(0),
    R.nth(1)
  ]),
  mergeAllArrayBuffers,
  H
));

/**
 * @param password
 * @param salt1
 * @param salt2
 * @return {PromiseLike<ArrayBuffer>}
 */
export function PH1(password, salt1, salt2) {
  return SH(password, salt1).then(R.partialRight(SH, [salt2]));
}

/**
 * @param password
 * @param salt1
 * @param salt2
 * @return {PromiseLike<ArrayBuffer>}
 */
export function PH2(password, salt1, salt2) {
  return PH1(password, salt1, salt2)
    .then(R.partialRight(pbkdf2, [salt1]))
    .then(R.partialRight(SH, [salt2]));
}

export function isGoodModExp(modexp, prime) {
  const diff = prime - modexp;

  const minDiffBitsCount = 2048 - 64;
  const maxModExpSize = 256;

  if (
    diff < 0 ||
    diff.toString('2').length < minDiffBitsCount ||
    modexp.toString('2').length < minDiffBitsCount ||
    Math.floor((modexp.toString('2').length + 7) / 8) > maxModExpSize
  ) {
    return false;
  }
  return true;
}

const SIZE_FOR_HASH = 256;

export function numBytesForHash(buffer) {
  return mergeArrayBuffer(new ArrayBuffer(SIZE_FOR_HASH - buffer.byteLength), buffer);
}

export function bigNumForHash(number) {
  const numHash = bigIntToArrayBuffer(number);
  return numBytesForHash(numHash);
}

export async function generateAndCheckRandom(g, p, bForHash) {
  const randomSize = 256;

  while (true) {
    const a = getRandomBigInt(randomSize);
    const A = powModulo(g, a, p);
    if (isGoodModExp(A, p)) {
      const aForHash = bigNumForHash(A);
      const uBuffer = await H(mergeArrayBuffer(aForHash, bForHash)); // eslint-disable-line
      const u = arrayBufferToBigInt(uBuffer);
      if (u > BigInt(0)) {
        return {a, aForHash, u};
      }
    }
  }
}


/**
 * @param {string} password
 * @param {*} accountPassword
 * @return {PromiseLike<*>}
 */
export async function buildInputCheckPasswordSRP(password, accountPassword) {
  const passwordBuffer = uint8ToArrayBuffer((new TextEncoder('utf-8').encode(password)));
  const {current_algo: algo} = accountPassword;
  const salt1 = new Uint8Array(algo.salt1);
  const salt2 = new Uint8Array(algo.salt2);

  const pwHash = await PH2(passwordBuffer, salt1, salt2);

  const p = uint8ToBigInt(algo.p);
  const g = BigInt(algo.g);
  // check p value here

  const B = uint8ToBigInt(accountPassword.srp_B);
  // check B value here

  const x = uint8ToBigInt(new Uint8Array(pwHash));
  const pForHash = numBytesForHash(uint8ToArrayBuffer(algo.p));
  const gForHash = bigNumForHash(g);
  const bForHash = numBytesForHash(uint8ToArrayBuffer(accountPassword.srp_B));
  const gX = powModulo(g, x, p);
  const kBuffer = await H(mergeArrayBuffer(pForHash, gForHash));
  const k = arrayBufferToBigInt(kBuffer);
  const kgX = (k * gX) % p;

  const {a, aForHash, u} = await generateAndCheckRandom(g, p, bForHash);
  const gB = (B - kgX) % p;

  if (!isGoodModExp(gB, p)) {
    throw new Error('bad gB');
  }

  const ux = u * x;
  const aUx = a + ux;
  const S = powModulo(gB, aUx, p);
  const K = await H(bigNumForHash(S));

  const M1 = await H(mergeAllArrayBuffers([
    xor(await H(pForHash), await H(gForHash)),
    await H(salt1),
    await H(salt2),
    aForHash,
    bForHash,
    K
  ]));

  return construct(
    'inputCheckPasswordSRP',
    {
      srp_id: accountPassword.srp_id,
      A: new Uint8Array(aForHash),
      M1: new Uint8Array(M1)
    }
  );
/*
  return PH2(passwordBuffer, salt1, salt2)
    .then(pwHash => {

      const v = powModulo(BigInt(g), x, p)


      const a = getRandomBigInt(256);
      const g_a = powModulo(BigInt(g), a, p);

      const uPromise = H(mergeArrayBuffer(bigIntToArrayBuffer(g_a), bigIntToArrayBuffer(g_b)))
        .then(arrayBufferToBigInt);
      const kPromise = H(mergeArrayBuffer(uint8ToArrayBuffer(algo.p), uint8ToArrayBuffer([g])))
        .then(arrayBufferToBigInt);

      return Promise.all([
        Promise.resolve(p),
        Promise.resolve(g),
        Promise.resolve(x),
        Promise.resolve(v),
        Promise.resolve(g_b),
        Promise.resolve(a),
        Promise.resolve(g_a),
        uPromise,
        kPromise,
      ]);
    })
    .then(R.apply((p, g, x, v, g_b, a, g_a, u, k) => {
      const k_v = (k * v) % p;
      const gb_sub_kv = (g_b - k_v) % p;
      const t = gb_sub_kv < BigInt(0) ? gb_sub_kv + p :  gb_sub_kv;
      const s_a = powModulo(t, a + u * x, p)
      const k_aPromise = H(bigIntToArrayBuffer(s_a));

      return Promise.all([
        H(bigIntToArrayBuffer(p)),
        H(bigIntToArrayBuffer(BigInt(g))),
        H(salt1),
        H(salt2),
        Promise.resolve(bigIntToArrayBuffer(g_a)),
        Promise.resolve(bigIntToArrayBuffer(g_b)),
        k_aPromise,
      ])
    }))
    .then(R.apply((p, g, salt1, salt2, g_a, g_b, k_a) => {
      return Promise.all([
        H(mergeAllArrayBuffers([
          xor(p, g),
          salt1,
          salt2,
          g_a,
          g_b,
          k_a,
        ])),
        g_a,
      ])
    }))
    .then(R.apply((m1, a) => {
    }));
    */
}
