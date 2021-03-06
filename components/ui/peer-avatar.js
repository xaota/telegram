import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';
import {getBasePeerInfo$} from '../../state/dialogs/stream-builders.js';
import {getInputPeerSelectorByPeerId, getTitle} from '../../state/dialogs/helpers.js';
import UIAvatar from './avatar.js';
import {wrapAsObjWithKey, createUrl, downloadFile$} from '../../script/helpers.js';

const {map, filter, distinctUntilChanged, withLatestFrom, switchMap} = rxjs.operators;

const {construct} = zagram;

const attributes = {};
const properties = {};

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
      withLatestFrom(inputPeer$.pipe(map(wrapAsObjWithKey('peer')))),
      map(R.mergeAll),
      distinctUntilChanged((prev, curr) => prev.local_id === curr.local_id && prev.volume_id === curr.volume_id),
      map(R.partial(construct, ['inputPeerPhotoFileLocation'])),
      switchMap(downloadFile$),
      map(createUrl)
    );

    avatar$.subscribe(
      url => { avatarNode.src = url; },
      error => {
        console.warn('Error ', peerId, error);
      }
    );

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
