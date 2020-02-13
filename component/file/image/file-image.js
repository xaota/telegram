import Component from '../../../script/Component.js';

import File from '../../../script/File.js';

import $, {updateChildrenAttribute} from '../../../script/DOM.js';


const component = Component.meta(import.meta.url, 'file-image');
const attributes = {
};

const properties = {

};

export default class FileImage extends Component {
   constructor(file) {
       super(component);
       this.file = file;
  }

  mount(node) {
    super.mount(node, attributes, properties);
    File.getFile(this.file)
        .then(blob => {
            updateChildrenAttribute(node, 'img', 'src', blob);
            $('img', node).style.visibility = 'visible';
        });
    return this;
  }

}

Component.init(FileImage, component, {attributes, properties});
