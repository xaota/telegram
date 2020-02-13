import Component from '../../../script/Component.js';

import file from '../file.js';

import $, {updateChildrenAttribute} from '../../../script/DOM.js';


const component = Component.meta(import.meta.url, 'file-image');
const attributes = {
};

const properties = {

};

export default class FileImage extends Component {
   constructor(remote) {
       super(component);
       this.remote = remote;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    file.getFile(this.remote)
        .then(blob => {
            updateChildrenAttribute(node, 'img', 'src', blob);
        })
    return this;
  }

}

Component.init(FileImage, component, {attributes, properties});
