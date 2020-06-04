import Component, {css, html} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';


const {fromEvent} = rxjs;

const style = css`
  .overlay {
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
    z-index: 150;
  }

`;
const properties = {};
const attributes = {};
/**
 * Modal component. Mounts passed component with componentParams.
 * Emits event when model should be unmounted.
 * Listen from children components, when we should close modal too
 */
export default class UIOverlay extends Component {
  static template = html`
    <template>
      <style>${style}</style>
      <div class="overlay">
      </div>
    </template>
  `;

  constructor(InnerComponent, ...componentParams) {
    super();
    this.InnerComponent = InnerComponent;
    this.componentParams = componentParams;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const overlayNode = $('.overlay', node);
    const InnerComponent = this.InnerComponent;
    const entity = new InnerComponent(...this.componentParams);
    overlayNode.appendChild(entity);

    const close$ = fromEvent(entity, 'close-modal');
    close$.subscribe(() => {
      this.event('close-modal');
    });
  }
}

Component.init(UIOverlay, 'ui-overlay', {properties, attributes});

export function attachOverlay(node, InitComponent, ...initParams) {
  const overlay = new UIOverlay(InitComponent, ...initParams);
  node.appendChild(overlay);
  const close$ = fromEvent(overlay, 'close-modal');
  close$.subscribe(() => {
    console.log('Remove overlay');
    overlay.remove();
  });
}
