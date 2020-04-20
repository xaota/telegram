/**
 * Takes dialog structure and returns last message
 */
const getLastMessage = R.pipe(
  R.of,
  R.ap([
    R.pipe(
      R.pathOr(-1, ['info', 'top_message']),
      x => x.toString(),
      R.partialRight(R.append, [['messages']])
    ),
    R.identity
  ]),
  R.apply(R.path)
);

export const getDialogWithLastMessage = R.pipe(
  R.of,
  R.ap([
    getLastMessage,
    R.prop('info')
  ]),
  R.apply(R.set(R.lensProp('last_message')))
);
