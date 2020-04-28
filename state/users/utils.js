/**
 * Takes telegram user object returns user full name
 */
export const getUserFullName = R.pipe(
  R.of,
  R.ap([
    R.propOr('', 'first_name'),
    R.propOr('', 'last_name')
  ]),
  R.join(' '),
  R.trim
);

/**
 * @param {Number} userId
 * @return {string}
 */
export const userIdToPeerId = userId => `peer_user_${userId}`;
