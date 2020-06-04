import {
  SET_ALL_STICKER_SETS,
  SET_DOCUMENT_BATCH
} from './constants.js';
import reducer from './reducer.js';

const {construct} = zagram;

describe('sticker reducer', () => {
  it('SET_ALL_STICKER_SETS', () => {
    const state = {};
    const action = {
      type: SET_ALL_STICKER_SETS,
      payload: construct(
        'messages.allStickers',
        {
          sets: [
            construct(
              'stickerSet',
              {
                access_hash: BigInt('13054418672949990316'),
                animated: true,
                archived: false,
                count: 25,
                hash: 3881906409,
                id: BigInt('1471004892762996739'),
                installed_date: 1588061293,
                masks: false,
                official: false,
                short_name: "Cat2O",
                thumb: construct(
                  'photoSize',
                  {
                    h: 100,
                    w: 100,
                    size: 12159,
                    type: "m",
                    location: construct(
                      'fileLocationToBeDeprecated',
                      {
                        local_id: 21768,
                        volume_id: BigInt('200023100428')
                      }
                    )
                  }
                ),
                thumb_dc_id: 2,
                title: "Cat2O"
              }
            ),
            construct(
              'stickerSet',
              {
                access_hash: BigInt('15400324302063802431'),
                animated: true,
                archived: false,
                count: 34,
                hash: 639036271,
                id: BigInt('2528601865977863'),
                installed_date: 1585814915,
                masks: false,
                official: false,
                short_name: "prtyparrot",
                title: "Party Parrot"
              }
            )
          ]
        }
      )
    };

    expect(reducer(state, action)).toEqual({
      stickerSets: [
        construct(
          'stickerSet',
          {
            access_hash: BigInt('13054418672949990316'),
            animated: true,
            archived: false,
            count: 25,
            hash: 3881906409,
            id: BigInt('1471004892762996739'),
            installed_date: 1588061293,
            masks: false,
            official: false,
            short_name: "Cat2O",
            thumb: construct(
              'photoSize',
              {
                h: 100,
                w: 100,
                size: 12159,
                type: "m",
                location: construct(
                  'fileLocationToBeDeprecated',
                  {
                    local_id: 21768,
                    volume_id: BigInt('200023100428')
                  }
                )
              }
            ),
            thumb_dc_id: 2,
            title: "Cat2O"
          }
        ),
        construct(
          'stickerSet',
          {
            access_hash: BigInt('15400324302063802431'),
            animated: true,
            archived: false,
            count: 34,
            hash: 639036271,
            id: BigInt('2528601865977863'),
            installed_date: 1585814915,
            masks: false,
            official: false,
            short_name: "prtyparrot",
            title: "Party Parrot"
          }
        )
      ]
    });
  });

  it('SET_STICKER_PACKS', () => {
    const state = {
      stickerSets: [
        construct(
          'stickerSet',
          {
            access_hash: BigInt('13054418672949990316'),
            animated: true,
            archived: false,
            count: 25,
            hash: 3881906409,
            id: BigInt('1471004892762996739'),
            installed_date: 1588061293,
            masks: false,
            official: false,
            short_name: "Cat2O",
            thumb: construct(
              'photoSize',
              {
                h: 100,
                w: 100,
                size: 12159,
                type: "m",
                location: construct(
                  'fileLocationToBeDeprecated',
                  {
                    local_id: 21768,
                    volume_id: BigInt('200023100428')
                  }
                )
              }
            ),
            thumb_dc_id: 2,
            title: "Cat2O"
          }
        ),
        construct(
          'stickerSet',
          {
            access_hash: BigInt('15400324302063802431'),
            animated: true,
            archived: false,
            count: 34,
            hash: 639036271,
            id: BigInt('2528601865977863'),
            installed_date: 1585814915,
            masks: false,
            official: false,
            short_name: "prtyparrot",
            title: "Party Parrot"
          }
        )
      ]
    };

    const action = {
      type: SET_DOCUMENT_BATCH,
      payload: construct(
        'messages.stickerSet',
        {
          documents: [
            construct(
              'document',
              {
                access_hash: BigInt('9436680901607060700'),
                attributes: [
                  construct("documentAttributeImageSize", {h: 512, w: 512}),
                  construct(
                    "documentAttributeSticker",
                    {
                      alt: "😂",
                      mask: false,
                      stickerset: construct(
                        'inputStickerSetID',
                        {
                          access_hash: BigInt('13054418672949990316'),
                          id: BigInt('1471004892762996739')
                        }
                      )
                    }
                  ),
                  construct("documentAttributeFilename", {file_name: "AnimatedSticker.tgs"})
                ],
                date: 1589832279,
                dc_id: 2,
                file_reference: [0, 94, 196, 228, 155, 90, 158, 176, 123, 204, 13, 116, 135, 184, 220, 7, 89, 155, 79, 108, 183],
                id: BigInt('1471004892762996810'),
                mime_type: "application/x-tgsticker",
                size: 26005,
                thumbs: [
                  construct(
                    'photoSize',
                    {
                      type: 'm',
                      h: 128,
                      w: 128,
                      size: 4302,
                      location: construct(
                        'fileLocationToBeDeprecated',
                        {
                          local_id: 2980,
                          volume_id: BigInt('200033000243')
                        }
                      )
                    }
                  )
                ]
              }
            ),
            construct(
              'document',
              {
                access_hash: BigInt('374422220912369659'),
                attributes: [
                  construct("documentAttributeImageSize", {h: 512, w: 512}),
                  construct(
                    "documentAttributeSticker",
                    {
                      alt: "😘",
                      mask: false,
                      stickerset: construct(
                        'inputStickerSetID',
                        {
                          access_hash: BigInt('13054418672949990316'),
                          id: BigInt('1471004892762996739')
                        }
                      )
                    }
                  ),
                  construct("documentAttributeFilename", {file_name: "AnimatedSticker.tgs"})
                ],
                date: 1585758314,
                dc_id: 2,
                file_reference: [0, 94, 196, 228, 155, 104, 152, 51, 232, 236, 179, 195, 111, 63, 140, 108, 59, 244, 118, 128, 237],
                id: BigInt('1471004892762996784'),
                mime_type: "application/x-tgsticker",
                size: 18757,
                thumbs: [
                  construct(
                    'photoSize',
                    {
                      h: 128,
                      w: 128,
                      size: 4456,
                      type: "m",
                      location: construct(
                        "fileLocationToBeDeprecated",
                        {
                          local_id: 20908,
                          volume_id: BigInt('200019300927')
                        }
                      )
                    }
                  )
                ]
              }
            )
          ],
          packs: [],
          set: construct(
            'stickerSet',
            {
              access_hash: BigInt('13054418672949990316'),
              animated: true,
              archived: false,
              count: 25,
              hash: 3881906409,
              id: BigInt('1471004892762996739'),
              installed_date: 1588061293,
              masks: false,
              official: false,
              short_name: "Cat2O",
              thumb: construct(
                'photoSize',
                {
                  h: 100,
                  w: 100,
                  size: 12159,
                  type: "m",
                  location: construct(
                    'fileLocationToBeDeprecated',
                    {
                      local_id: 21768,
                      volume_id: BigInt('200023100428')
                    }
                  )
                }
              ),
              thumb_dc_id: 2,
              title: "Cat2O"
            }
          )
        }
      )
    };

    expect(reducer(state, action)).toEqual({
      stickerSets: [
        construct(
          'stickerSet',
          {
            access_hash: BigInt('13054418672949990316'),
            animated: true,
            archived: false,
            count: 25,
            hash: 3881906409,
            id: BigInt('1471004892762996739'),
            installed_date: 1588061293,
            masks: false,
            official: false,
            short_name: "Cat2O",
            thumb: construct(
              'photoSize',
              {
                h: 100,
                w: 100,
                size: 12159,
                type: "m",
                location: construct(
                  'fileLocationToBeDeprecated',
                  {
                    local_id: 21768,
                    volume_id: BigInt('200023100428')
                  }
                )
              }
            ),
            thumb_dc_id: 2,
            title: "Cat2O"
          }
        ),
        construct(
          'stickerSet',
          {
            access_hash: BigInt('15400324302063802431'),
            animated: true,
            archived: false,
            count: 34,
            hash: 639036271,
            id: BigInt('2528601865977863'),
            installed_date: 1585814915,
            masks: false,
            official: false,
            short_name: "prtyparrot",
            title: "Party Parrot"
          }
        )
      ],
      stickerSetDocuments: {
        '1471004892762996739': [
          construct(
            'document',
            {
              access_hash: BigInt('9436680901607060700'),
              attributes: [
                construct("documentAttributeImageSize", {h: 512, w: 512}),
                construct(
                  "documentAttributeSticker",
                  {
                    alt: "😂",
                    mask: false,
                    stickerset: construct(
                      'inputStickerSetID',
                      {
                        access_hash: BigInt('13054418672949990316'),
                        id: BigInt('1471004892762996739')
                      }
                    )
                  }
                ),
                construct("documentAttributeFilename", {file_name: "AnimatedSticker.tgs"})
              ],
              date: 1589832279,
              dc_id: 2,
              file_reference: [0, 94, 196, 228, 155, 90, 158, 176, 123, 204, 13, 116, 135, 184, 220, 7, 89, 155, 79, 108, 183],
              id: BigInt('1471004892762996810'),
              mime_type: "application/x-tgsticker",
              size: 26005,
              thumbs: [
                construct(
                  'photoSize',
                  {
                    type: 'm',
                    h: 128,
                    w: 128,
                    size: 4302,
                    location: construct(
                      'fileLocationToBeDeprecated',
                      {
                        local_id: 2980,
                        volume_id: BigInt('200033000243')
                      }
                    )
                  }
                )
              ]
            }
          ),
          construct(
            'document',
            {
              access_hash: BigInt('374422220912369659'),
              attributes: [
                construct("documentAttributeImageSize", {h: 512, w: 512}),
                construct(
                  "documentAttributeSticker",
                  {
                    alt: "😘",
                    mask: false,
                    stickerset: construct(
                      'inputStickerSetID',
                      {
                        access_hash: BigInt('13054418672949990316'),
                        id: BigInt('1471004892762996739')
                      }
                    )
                  }
                ),
                construct("documentAttributeFilename", {file_name: "AnimatedSticker.tgs"})
              ],
              date: 1585758314,
              dc_id: 2,
              file_reference: [0, 94, 196, 228, 155, 104, 152, 51, 232, 236, 179, 195, 111, 63, 140, 108, 59, 244, 118, 128, 237],
              id: BigInt('1471004892762996784'),
              mime_type: "application/x-tgsticker",
              size: 18757,
              thumbs: [
                construct(
                  'photoSize',
                  {
                    h: 128,
                    w: 128,
                    size: 4456,
                    type: "m",
                    location: construct(
                      "fileLocationToBeDeprecated",
                      {
                        local_id: 20908,
                        volume_id: BigInt('200019300927')
                      }
                    )
                  }
                )
              ]
            }
          )
        ]
      }
    });
  });
});
