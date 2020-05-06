import Component, {html, css} from '../../script/ui/Component.js';
import $ from '../../script/ui/DOM.js';

const {fromEvent, combineLatest, animationFrameScheduler} = rxjs;
const {map, observeOn, startWith} = rxjs.operators;

const style = css`
  :host {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .view {
    flex-grow: 1;
    overflow-y: auto;
    height: 0px;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    box-sizing: border-box;
  }
  
  .load-more {
    flex-shrink: 0;
    height: 30px;
    background: #ff0000;
    opacity: 0;
  }
`;
const attributes = {};
const properties = {};
export default class VirtualList extends Component {
  static template=html`
    <template>
      <style>${style}</style>
      <div class="view">
        <div class="content">
        </div>
        <div class="load-more">
        </div>
      </div>
    </template>
  `

  constructor(data$, ElementUI, rowHeight, getKey = R.identity) {
    super();
    this.data$ = data$;
    this.ElementUI = ElementUI;
    this.rowHeight = rowHeight;
    this.getKey = getKey;
    this.renderedElements = {};
  }

  mount(node) {
    super.mount(node, attributes, properties);
    const options = {
      root: $(':host', node),
      rootMargin: '0px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver((changes, observer) => {
      this.event('load-more');
    }, options);

    const loadMoreNode = $('.load-more', node);
    observer.observe(loadMoreNode);

    const view = $('.view', node);
    const content = $('.content', node);
    this.data$.subscribe(data => {
      const contentHeight = data.length * this.rowHeight;
      content.style.height = `${contentHeight}px`;
    });

    const scroll$ = fromEvent(view, 'scroll').pipe(startWith(null));
    const renderScroll$ = combineLatest(scroll$, this.data$).pipe(
      map(R.nth(1)),
      observeOn(animationFrameScheduler)
    );

    renderScroll$.subscribe(data => {
      const viewportHeight = view.clientHeight;
      const contentHeight = data.length * this.rowHeight;
      content.style.height = `${contentHeight}px`;

      const visibleCount = Math.ceil(viewportHeight / this.rowHeight);
      const offsetCount = Math.floor(view.scrollTop / this.rowHeight);

      const visibleData = R.slice(offsetCount, offsetCount + visibleCount, data);
      const visibleKeys = new Set();
      const ElementUI = this.ElementUI;
      for (let i = 0; i < visibleData.length; i++) {
        const key = this.getKey(visibleData[i]);
        visibleKeys.add(key);

        if (!this.renderedElements[key]) {
          const element = new ElementUI(visibleData[i]);
          this.renderedElements[key] = element;
          content.appendChild(element);
        }
        this.renderedElements[key].style.order = R.toString(i);
      }

      const firstData = visibleData[0];
      if (firstData) {
        content.style.paddingTop = `${offsetCount * this.rowHeight}px`;
      }

      const allKeys = R.keys(this.renderedElements);
      for (const key of allKeys) {
        if (!visibleKeys.has(key)) {
          this.renderedElements[key].remove();
          delete this.renderedElements[key];
        }
      }
    });
  }
}

Component.init(VirtualList, 'virtual-list', {properties, attributes});
