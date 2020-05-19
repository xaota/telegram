import Component, {html, css} from '../../script/ui/Component.js';
import emojiList from './emoji-list.js';

const {fromEvent} = rxjs;

const style = css`
  :host {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items:
  }
  
  .emoji {
    width: 32px;
    height: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 1.5em;
    cursor: pointer;
  }
  
  .emoji:hover {
    background-color: var(--iconHover);
  }
`;

const properties = {};
const attributes = {};
export default class EmojiPicker extends Component {
  static template = html`
    <template>
      <style>${style}</style>
    </template>
  `;

  mount(node) {
    super.mount(node, attributes, properties);

    for (let i = 0; i < emojiList.length; i++) {
      const emojiItem = emojiList[i];
      const emojiItemNode = document.createElement('div');
      emojiItemNode.innerText = emojiItem.emoji;
      emojiItemNode.classList.add('emoji');
      const click$ = fromEvent(emojiItemNode, 'click');
      click$.subscribe(() => {
        this.event('emoji-selected', emojiItem);
      });
      node.appendChild(emojiItemNode);
    }

    return this;
  }
}

Component.init(EmojiPicker, 'emoji-picker', {attributes, properties});
