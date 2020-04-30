import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {buildInputPhotoFileLocation} from '../../script/utils/message.js';
import {createUrl, downloadFile$} from '../../script/helpers.js';

const {map} = rxjs.operators;

const style = css``;
const attributes = {};
const properties = {};

export default class SplashScreenPhoto extends Component {
  static template = html`
    <template>
        <style>${style}</style>
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

    const inputFileLocation = buildInputPhotoFileLocation(message);
    console.log('[MESSAGE]', message);
    console.log('[FULL PHOTO]', inputFileLocation);
    const download$ = downloadFile$(inputFileLocation);
    download$.pipe(map(createUrl)).subscribe(url => {
      const imgNode = $('img', node);
      imgNode.src = url;
    });
  }
}

Component.init(SplashScreenPhoto, 'splash-screen-photo', {attributes, properties});
