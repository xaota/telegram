import Component from '../../../script/Component.js';
import $ from '../../../script/DOM.js';

/* eslint-disable */
import UIIcon    from '../../ui/icon/ui-icon.js';
/* eslint-enable */

const {fromEvent, combineLatest, from, animationFrameScheduler, bindCallback} = rxjs;
const {map, switchMap, tap, subscribeOn, takeUntil, withLatestFrom, startWith} = rxjs.operators;

const component = Component.meta(import.meta.url, 'enter-avatar');
const attributes = {};
const properties = {};

function showNode(overlay, type) {
  overlay.style.display = type || 'block';
}

function hideNode(overlay) {
  overlay.style.display = 'none';
}

const getImageFromEvent = R.path(['path', 0]);

const getNaturalWidth = R.prop('naturalWidth');
const getNaturalHeight = R.prop('naturalHeight');

const wrapAsObjWithKey = R.pipe(
  R.lensProp,
  R.partialRight(R.set, [R.__, {}])
);

const getImageSizeFromEvent = R.pipe(
  getImageFromEvent,
  R.of,
  R.ap([
    R.pipe(getNaturalWidth, wrapAsObjWithKey('width')),
    R.pipe(getNaturalHeight, wrapAsObjWithKey('height'))
  ]),
  R.mergeAll
);

function getImageSize$(file) {
  const img = document.createElement('img');
  const img$ = fromEvent(img, 'load');
  img.src = window.URL.createObjectURL(file);
  return img$.pipe(map(getImageSizeFromEvent));
}

function nameNewAvatar(blob) {
  blob.name = 'avatar.png';
  blob.lastModified = new Date();
  return blob;
}

export default class EnterAvatar extends Component {
  constructor() {
    super(component);
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const profilePhotoInput = $("#enterName_fileInput", node);
    const editPhotoImg = $('#editPhotoImg', node);
    const photoIcon = $('#photo-add', node);
    const overlay = $('#overlay', node);
    const photoCanvas = $('.photoCanvas', node);
    const photoCanvasBackground = $('.photoCanvasBackground', node);
    const resultCanvas = $('#resultCanvas', node);
    const closeButton = $('#editPhoto_closeButton', node);
    const okButton = $('#editPhoto_okButton', node);

    const cropAvatar = pos => {
      const resultCtx = resultCanvas.getContext('2d');
      const sx = pos.left - 80;
      const sy = pos.top - 80;
      resultCtx.clearRect(0, 0, 160, 160);
      resultCtx.drawImage(photoCanvas, sx, sy, 160, 160, 0, 0, 160, 160 );

      hideNode(photoIcon);
      showNode(resultCanvas);
    };

    const highLightSelected = pos => {
      photoCanvas.style.clipPath = `circle(80px at ${pos.left}px ${pos.top}px)`;
    };

    const profilePhoto$ = fromEvent(profilePhotoInput, 'change');
    profilePhoto$
      .pipe(
        map(() => profilePhotoInput.files[0]),
        switchMap(file => combineLatest(
          getImageSize$(file),
          from(createImageBitmap(file))
        )),
        tap(([photoSize, img]) => {
          const canvasSize = {
            width: photoCanvas.width,
            height: photoCanvas.height
          };

          const ratio = photoSize.width / canvasSize.width;

          canvasSize.height = photoSize.height / ratio;
          photoCanvas.height = canvasSize.height;
          photoCanvasBackground.height = canvasSize.height;
          editPhotoImg.style.width = `${canvasSize.width}px`;
          editPhotoImg.style.height = `${canvasSize.height}px`;

          const ctx = photoCanvas.getContext('2d');
          const ctxBackground = photoCanvasBackground.getContext('2d');
          ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
          ctxBackground.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
          showNode(overlay, 'flex');
          highLightSelected({left: 80, top: 80});
        })
      )
      .subscribe(() => {
        profilePhotoInput.value = null;
      });

    const closeButtonClick$ = fromEvent(closeButton, 'click');
    closeButtonClick$.subscribe(() => hideNode(overlay));


    const mousedown$ = fromEvent(photoCanvas, 'mousedown');
    const mousemove$ = fromEvent(document, 'mousemove');
    const mouseup$ = fromEvent(photoCanvas, 'mouseup');

    const drag$ = mousedown$.pipe(
      switchMap(start => {
          const bounds = photoCanvas.getBoundingClientRect();
          return mousemove$.pipe(
map(move => {
              move.preventDefault();
              return {
                left: move.pageX - bounds.x,
                top:  move.pageY - bounds.y
              };
            }),
            takeUntil(mouseup$)
);
        }),
      startWith({top: 80, left: 80})
    );

    const position$ = drag$.pipe(
      subscribeOn(animationFrameScheduler),
      tap(highLightSelected)
    );

    const okButtonClick$ = fromEvent(okButton, 'click');

    const getToBlob$ = bindCallback(cb => photoCanvas.toBlob(cb, 'image/png'));

    const confirmedPosition$ = okButtonClick$.pipe(
      withLatestFrom(position$),
      map(R.nth(1)),
      tap(cropAvatar),
      tap(R.partial(hideNode, [overlay])),
      switchMap(() => getToBlob$()),
      map(nameNewAvatar)
    );

    confirmedPosition$.subscribe(blob => {
      this.event('newAvatar', blob);
    });

    return this;
  }
}

Component.init(EnterAvatar, component, {attributes, properties});
