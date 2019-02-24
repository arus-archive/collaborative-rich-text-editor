// @ts-check

import { TOKEN_KEY, DOCUMENT_ID_KEY } from './config';

import apiInitialize from './api/initialization';
import { getQueryVariable, getUserName } from './utils';
import {
  updateStatus,
  updateCaption,
  updateUserList,
  debugInfo, updateUser,
} from './view';

import Editor from './editor';
import Document from './document';
import UserCursors from './userCursors';

import '../style.css';

updateCaption('Loading...');

const editor = new Editor('#editor');

/**
 * Start application
 * @param {module:user.User} user
 * @param {module:document.Document} document
 */
function startApplication(user, document) {
  console.log(document)
  updateCaption(document.title);

  editor.enable();

  const userCursors = new UserCursors(user, document);
  updateUserList(userCursors.getConnections(), userCursors.getLocalCursor());

  const localDocument = new Document(document.id);
  localDocument.onStateChange((state, reason) => {
    debugInfo(`ShareDB new connection state: ${state} Reason: ${reason}`);
  });

  localDocument.subscribe(() => {
    editor.setContent(localDocument.getData());

    editor.onTextChange((delta, oldDelta, source) => {
      if (source === 'user') {
        // Check if it's a formatting-only delta
        const formattingDelta = delta.reduce(
          (check, operationTransformation) => (
            (
              operationTransformation.insert || operationTransformation.delete
            ) ? false : check
          ),
          true,
        );

        if (!formattingDelta) {
          userCursors.collapseLocalSelection();
        }

        localDocument.submitOperationalTransformation(delta, editor.getEditor());
        updateUserList(userCursors.getConnections(), userCursors.getLocalCursor());
      }
    });

    editor.registerCursorsTextChangeListener();

    localDocument.onOperationalTransformation((operationTransformation, source) => {
      if (!editor.isEditorEqual(source)) {
        editor.updateContent(operationTransformation);
        updateUserList(userCursors.getConnections(), userCursors.getLocalCursor());
      }
    });

    localDocument.onNothingPending(userCursors.debouncedSendCursorData(editor.getEditor()));

    editor.onSelectionChange((range) => {
      userCursors.setLocalCursorSelectionRange(range);
      userCursors.sendLocalUserCursor();
    });

    userCursors.onCursorsUpdate = (detail) => {
      editor.removeCursors(detail.removedConnections);
      userCursors.updateCursors(detail.source, editor.getCursorsModule());
      updateUserList(userCursors.getConnections(), userCursors.getLocalCursor());
    };
    userCursors.updateCursors(userCursors.getLocalCursor(), editor.getCursorsModule());
    updateUserList(userCursors.getConnections(), userCursors.getLocalCursor());
  });
}

const token = getQueryVariable(window.location.search, TOKEN_KEY);
const documentId = getQueryVariable(window.location.search, DOCUMENT_ID_KEY);

updateStatus(
  'Initialization',
  `Request initialization (token: ${token}, documentId: ${documentId})`,
);

apiInitialize(token, documentId)
  .then((data) => {
    const {
      status,
      message,
      user,
      document,
    } = data;
    updateStatus(
      `Initialized (${getUserName(user)})`,
      `Initialized (status: ${status}, message: ${message})`,
      'green',
    );
    updateUser(user);
    startApplication(user, document);
  })
  .catch((error) => {
    updateStatus(error.status, error.debug, 'red');
    throw error;
  });
