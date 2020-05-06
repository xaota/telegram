import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {createUrl, downloadFile$} from '../../script/helpers.js';
import {setMessageSplashScreen} from '../../state/ui/index.js';
import {buildThumbnailFileLocation} from '../../script/utils/message.js';

const {fromEvent} = rxjs;
const {map} = rxjs.operators;

const style = css`
  :host {
    display: inline-flex;
    background-size: cover;
    flex: 1 0 calc(33% - 4px);
    cursor: pointer;
  }

  .image {
    display: flex;
    width: 100%;
    height 100%;
    background-size: cover;
    background-position: center;
    background-color: grey;
  }

  .image:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const attributes = {};
const properties = {};

export default class MediaPreview extends Component {
  static template = html`
    <template>
        <style>${style}</style>
        <div class="image"></div>
    </template>
  `;

  constructor(message) {
    super();
    this.store({message});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const divNode = $('.image', node);

    const {message} = this.store();
    const inputPhotoLocation = buildThumbnailFileLocation(message);

    downloadFile$(inputPhotoLocation)
      .pipe(map(createUrl))
      .subscribe(
        url => divNode.style.backgroundImage = `url(${url})`,
        error => {
          console.warn('Can`t load file:' );
          console.warn('message:', message);
          console.warn('location:', inputPhotoLocation);
          console.warn('error:', error);
        }
      );

    const click$ = fromEvent(node, 'click');
    click$.subscribe(R.partial(setMessageSplashScreen, [message]));
    return this;
  }

  render(node) {
    return this;
  }
}

Component.init(MediaPreview, 'media-preview', {attributes, properties});
