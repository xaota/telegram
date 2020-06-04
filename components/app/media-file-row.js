import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

import MediaPreview from './media-preview.js';

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  
  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
`;
const attributes = {};
const properties = {};
export default class MediaFileRow extends Component {
  static template = html`
    <template>
      <style>${style}</style> 
      <div class="row"></div>
    </template>
  `;

  constructor(messages) {
    super();
    this.store({messages});
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const {messages} = this.store();
    const rowNode = $('.row', node);

    for (let i = 0; i < messages.length; i++) {
      const mediaPreview = new MediaPreview(messages[i]);
      rowNode.appendChild(mediaPreview);
    }

    return this;
  }
}

Component.init(MediaFileRow, 'media-file-row', {attributes, properties});
