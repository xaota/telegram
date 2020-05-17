import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {clearMessageSplashScreen} from '../../state/ui/index.js';
import {getSplashScreenMessage$} from '../../state/ui/stream-builders.js';
import {getMessageType} from '../../script/utils/message.js';

/* eslint-disable */
import UIIcon from '../ui/icon.js'
import SplashScreenHeader from '../app/splash-screen-header.js'
import SplashScreenPhoto from '../app/splash-screen-photo.js'
import SplashScreenVideo from '../app/splash-screen-video.js'
/* eslint-enable */

const {fromEvent} = rxjs;
const {distinctUntilChanged} = rxjs.operators;

const getId = R.propOr(-1, 'id');

const getSplashScreenView = R.cond([
  [R.isNil, R.identity],
  [R.pipe(getMessageType, R.equals('messageVideo')), R.always(SplashScreenVideo)],
  [R.T, R.always(SplashScreenPhoto)]
]);

const style = css`
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.93);
    z-index: 100;
  }
  
  .header {
    display: flex;
    flex-direction: row;
    height: 56px;
    padding: 0 24px;
    flex-grow: 0;
    align-items: center;
    margin-top: 8px;
  }
  
  .base-header {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
  }
  
  .side-header {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
  }
  
  ui-icon {
    cursor: pointer;
  }
  
  ui-icon:hover {
  }
  
  .icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .icon:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .icon:hover ui-icon {
    color: #fff;
  }
  
  
  .body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }
  
  .footer {
    display: flex;
    flex-direction: row;
    height: 56px;
    flex-grow: 0;
    align-items: center;
    margin-bottom: 8px;
  }
`;

const attributes = {};
const properties = {};

export default class LayoutSplashscreen extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="header">
        <div class="base-header">
        </div>
        <div class="side-header">
            <div id="#close" class="icon">
                <ui-icon id="close">close</ui-icon>
            </div>
        </div>
      </div>
      <div class="body"></div>
      <div class="footer"></div>
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);
    const closeNode = $('#close', node);
    const closeClick$ = fromEvent(closeNode, 'click');

    const state$ = getState$();
    const message$ = getSplashScreenMessage$(state$)
      .pipe(distinctUntilChanged((a, b) => getId(a) === getId(b)));

    message$.subscribe(message => {
      if (!R.isNil(message)) {
        this.store({message});
      } {
        const headerNode = $('.base-header', node);
        headerNode.innerHTML = '';
        const splashScreenHeader = new SplashScreenHeader(message);
        headerNode.appendChild(splashScreenHeader);

        const bodyNode = $('.body', node);
        bodyNode.innerHTML = '';

        const SplashScreen = getSplashScreenView(message);
        if (SplashScreen) {
          const splashScreen = new SplashScreen(message);
          bodyNode.appendChild(splashScreen);
        }
      }
    });

    closeClick$.subscribe(() => {
      clearMessageSplashScreen();
    });
    return this;
  }

  render(node) {
    return this;
  }
}

Component.init(LayoutSplashscreen, 'layout-splashscreen', {attributes, properties});


