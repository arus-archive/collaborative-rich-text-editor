// @ts-check

import Quill from 'quill';
import QuillCursors from 'quill-cursors/src/cursors';

import 'font-awesome/css/font-awesome.css';
import 'quill/dist/quill.snow.css';
import 'quill-cursors/dist/quill-cursors.css';

function Editor(root) {
  Quill.register('modules/cursors', QuillCursors);

  function quillLinkAddProtocol() {
    const Link = Quill.import('formats/link');
    const builtInFunc = Link.sanitize;
    Link.sanitize = function customSanitizeLinkInput(linkValueInput) {
      let val = linkValueInput;
      const urlHasCustomProtocol = /^\w+:/.test(val);
      if (!urlHasCustomProtocol && !/^https?:/.test(val)) {
        val = `http://${val}`;
      }
      return builtInFunc.call(this, val);
    };
  }

  quillLinkAddProtocol();

  const quill = new Quill(root, {
    theme: 'snow',
    modules: {
      cursors: {
        autoRegisterListener: false,
      },
      history: {
        userOnly: true,
      },
    },
    readOnly: true,
  });

  this.enable = () => {
    quill.enable();
  };

  this.setContent = (data) => {
    quill.setContents(data);
  };

  this.updateContent = (operationTransformation) => {
    quill.updateContents(operationTransformation);
  };

  this.onTextChange = (callback) => {
    quill.on('text-change', callback);
  };

  this.onSelectionChange = (callback) => {
    quill.on('selection-change', callback);
  };

  this.getEditor = () => quill;
  this.isEditorEqual = editor => editor === quill;

  const cursorsModule = quill.getModule('cursors');
  this.getCursorsModule = () => cursorsModule;
  this.registerCursorsTextChangeListener = () => {
    cursorsModule.registerTextChangeListener();
  };

  this.removeCursors = (removedCursors) => {
    removedCursors.forEach((removedCursor) => {
      if (cursorsModule.cursors[removedCursor.id]) {
        cursorsModule.removeCursor(removedCursor.id);
      }
    });
  };
}

export default Editor;
