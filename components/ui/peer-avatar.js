import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getBasePeerInfo$} from '../../state/dialogs/stream-builders.js';
import {getTitle, getInputPeerSelectorByPeerId} from '../../state/dialogs/helpers.js';
import UIAvatar from './avatar.js';
import {wrapAsObjWithKey} from '../../script/helpers.js';

const fromPromise = rxjs.from;
const {map, filter, distinctUntilChanged, withLatestFrom, switchMap} = rxjs.operators;

const {construct} = zagram;

const attributes = {};
const properties = {};

/**
 * @param {*} inputFileLocation - telegrams inputFileLocation object
 * @returns {Observable<*>} - stream of downloaded file
 */
function downloadFile$(inputFileLocation) {
  const {promise} = telegram.connection.download(inputFileLocation);
  return fromPromise(promise);
}

function createUrl(file) {
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(file);
}

const style = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 100%;
    height: 100%;
  }
  
  ui-avatar {
    width: 100%;
    height: 100%;
  }
`;

export default class PeerAvatar extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <ui-avatar></ui-avatar>
    </template>
  `;

  /**
   * @param {string} peerId
   */
  constructor(peerId) {
    super();
    this.store({peerId});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const avatarNode = $('ui-avatar', node);
    const {peerId} = this.store();
    const state$ = getState$();
    const peerInfo$ = getBasePeerInfo$(state$, peerId);

    peerInfo$.subscribe(peerInfo => {
      this.store({peerInfo});
    });

    const inputPeer$ = state$.pipe(map(getInputPeerSelectorByPeerId(peerId)));
    const isNotNull = R.pipe(R.isNil, R.not);

    const avatar$ = peerInfo$.pipe(
      map(R.pathOr(null, ['photo', 'photo_small'])),
      filter(isNotNull),
      map(R.pick(['local_id', 'volume_id'])),
      distinctUntilChanged(),
      withLatestFrom(inputPeer$.pipe(map(wrapAsObjWithKey('peer')))),
      map(R.mergeAll),
      map(R.partial(construct, ['inputPeerPhotoFileLocation'])),
      switchMap(downloadFile$),
      map(createUrl)
    );

    avatar$.subscribe(url => {
      avatarNode.src = url;
    });

    return this;
  }

  render(node) {
    const {peerInfo} = this.store();
    if (R.isNil(peerInfo)) {
      return this;
    }
    const avatarNode = $('ui-avatar', node);

    const title = getTitle(peerInfo);
    avatarNode.color = UIAvatar.color(peerInfo.id);
    avatarNode.innerText = UIAvatar.letter(title);
    return this;
  }
}

Component.init(PeerAvatar, 'peer-avatar', {attributes, properties});
