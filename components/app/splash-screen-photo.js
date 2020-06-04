import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {buildInputPhotoFileLocation} from '../../script/utils/message.js';
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
`;
const attributes = {};
const properties = {};
export default class SplashScreenPhoto extends Component {
  static template = html`
    <template>
        <style>${style}</style>
        <ui-loading></ui-loading>
        <img alt="preview" />
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

    const imgNode = $('img', node);
    imgNode.style.display = 'none';

    const inputFileLocation = buildInputPhotoFileLocation(message);
    const download$ = downloadFile$(inputFileLocation);
    download$.pipe(map(createUrl)).subscribe(url => {
      imgNode.src = url;
      imgNode.style.display = 'inline';
      uiLoadingNode.style.display = 'none';
    });
  }
}

Component.init(SplashScreenPhoto, 'splash-screen-photo', {attributes, properties});
