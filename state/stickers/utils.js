export const getStickerSetId = R.pipe(
  R.prop('id'),
  R.toString
);
