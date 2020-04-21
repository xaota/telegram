import Component, {html, css} from "../../script/ui/Component.js";
import $ from '../../script/ui/DOM.js';
import {wrapAsObjWithKey} from '../../../script/helpers.js';

const {fromEvent, combineLatest, from, animationFrameScheduler, bindCallback} = rxjs;
const {map, switchMap, tap, subscribeOn, takeUntil, withLatestFrom, startWith} = rxjs.operators;

function showNode(overlay, type) {
  overlay.style.display = type || 'block';
}

function hideNode(overlay) {
  overlay.style.display = 'none';
}

const getImageFromEvent = R.path(['path', 0]);

const getNaturalWidth = R.prop('naturalWidth');
const getNaturalHeight = R.prop('naturalHeight');

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

/* eslint-disable */
import UIIcon from '../ui/icon.js';
/* eslint-enable */

const style = css`
  .enter-avatar {
    position: relative;
    background: #4ea4f6;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
    width: 160px;
    height: 160px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
    cursor: pointer;
    --iconHover: #fff;
    --iconStatic: #fff;
  }

  ui-icon#photo-add {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0.3);
  }

  #resultCanvas {
    border-radius: 50%;
  }

  #overlay {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(2, 30, 60, 0.38);
    z-index: 100;
  }

  #editPhotoPopup {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 35vw;
    background-color: #fff;
    border-radius: 8px;
  }

  .editPhotoHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 48px;
  }

  .editPhotoBody {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    padding-left: 48px;
    padding-right: 48px;
  }

  .editPhotoBottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: 48px;
  }

  .btn-circle {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .btn-primary {
    --iconHover: #fff;
    --iconStatic: #fff;
    color: #fff;
    background: #4ea4f6;
  }

  .closeButtonWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }

  .btn {
    cursor: pointer;
  }

  .photoCanvas {
    position: absolute;
    top: 0;
    left: 0;
    clip-path: circle(80px at 80px 80px);
    flex-grow: 1;
  }

  .photoCanvasBackground {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.3;
  }

  #editPhotoImg {
    position: relative;
  }`;

const attributes = {};
const properties = {};

/** {AppAvatar} @class
  * @description Отображение экрана входа
  */
  export default class AppAvatar extends Component {
    static template = html`
      <template>
        <style>${style}</style>
        <label for="enterName_fileInput">
          <input id="enterName_fileInput" type="file" accept="image/*" style="display: none">
          <div class="enter-avatar">
            <ui-icon id="photo-add">photo-add</ui-icon>
            <canvas id="resultCanvas" width="160" height="160"></canvas>
          </div>
          </label>
          <div id="overlay" style="display: none">
            <div id="editPhotoPopup">
              <div class="editPhotoHeader">
                <div class="closeButtonWrapper">
                  <a id="editPhoto_closeButton" class="btn"><ui-icon>close</ui-icon></a>
                </div>
                <div class="editPhoto_title">Drag to Reposition</div>
              </div>
              <div class="editPhotoBody">
                <div id="editPhotoImg">
                  <canvas width="300" class="photoCanvasBackground"></canvas>
                  <canvas width="300" class="photoCanvas"></canvas>
                </div>
              </div>
              <div class="editPhotoBottom">
                <a id="editPhoto_okButton" class="btn btn-primary btn-circle">
                  <ui-icon>check</ui-icon>
                </a>
              </div>
            </div>
          </div>
      </template>`;

  // /** Создание компонента {AppAvatar} @constructor
  //   * @param {string?} text содержимое элемента
  //   */
  //   constructor(text) {
  //     super();
  //     if (text) this.innerText = text;
  //   }

  /** Создание элемента в DOM (DOM доступен) / mount @lifecycle
    * @param {ShadowRoot} node корневой узел элемента
    * @return {Component} @this {AppAvatar} текущий компонент
    */
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
    }
  }

Component.init(AppAvatar, 'app-avatar', {attributes, properties});
