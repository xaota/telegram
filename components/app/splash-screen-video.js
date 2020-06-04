import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {buildInputDocumentFileLocation} from '../../script/utils/message.js';
import {createUrl, downloadFile$} from '../../script/helpers.js';

/* eslint-disable */
import UILoading from '../ui/loading.js'
/* eslint-enable */

const {map} = rxjs.operators;

const style = css`
ui-loading {
  color: #fff;
  fill: #fff;
  width: 40px;
  height: 40px;
}

video {
  max-height: 70vh;
}
`;
const attributes = {};
const properties = {};
export default class SplashScreenVideo extends Component {
  static template = html`
    <template>
        <style>${style}</style>
        <ui-loading></ui-loading>
        <video />
    </template>
  `;

  constructor(message) {
    super();
    this.store({message});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const {message} = this.store();

    const uiLoadingNode = $('ui-loading', node);

    const videoNode = $('video', node);
    videoNode.style.display = 'none';

    const inputFileLocation = buildInputDocumentFileLocation(message);
    const download$ = downloadFile$(inputFileLocation);
    download$.pipe(map(createUrl)).subscribe(url => {
      videoNode.src = url;
      videoNode.setAttribute('controls', true);
      videoNode.style.display = 'inline';
      uiLoadingNode.style.display = 'none';
    });
  }
}

Component.init(SplashScreenVideo, 'splash-screen-video', {attributes, properties});
