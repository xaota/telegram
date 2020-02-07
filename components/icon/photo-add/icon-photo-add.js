import Component from '../../../script/Component.js';

const component = Component.meta(import.meta.url, 'icon-photo-add');
export default class IconPhotoAdd extends Component {
  constructor() {
    super(component);
  }
}

Component.init(IconPhotoAdd, component, {});
