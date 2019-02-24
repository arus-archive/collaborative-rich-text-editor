// @ts-check

import { debugInfo } from './view';
import { getUserName, createWebSocket, debounce } from './utils';

/**
 * Start notebook
 * @param {module:user.User} localUser
 * @param {module:document.Document} localDocument
 */
function UserCursors(localUser, localDocument) {
  const cursorsSocket = createWebSocket('cursors');

  /**
   * Array of cursors
   * @type {module:cursors.CursorConnection[]}
   */
  const connections = [];

  this.getConnections = () => connections;

  /**
   * @type {module:cursors.CursorConnection}
   */
  const localCursor = {
    id: null,
    user: localUser,
    document: localDocument,
    color: null,
  };

  this.getLocalCursor = () => localCursor;

  this.setLocalCursorSelectionRange = (range) => {
    localCursor.range = range;
  };

  // old update()
  this.sendLocalUserCursor = () => cursorsSocket.send(JSON.stringify(localCursor));

  this.onCursorsUpdate = () => {
  };

  this.collapseLocalSelection = () => {
    const localConnectionRange = localCursor.range;
    if (localConnectionRange && localConnectionRange.length) {
      localConnectionRange.index += localConnectionRange.length;
      localConnectionRange.length = 0;
      this.sendLocalUserCursor();
    }
  };

  this.updateCursors = (source, cursorsModule) => {
    const activeConnections = {};
    const updateAll = Object.keys(cursorsModule.cursors).length === 0;
    const localConnectionId = localCursor.id;
    connections.forEach((connection) => {
      const currentConnection = connection.id === localConnectionId;
      if (!currentConnection) {
        // Update cursor that sent the update, source (or update all if we're initiating)
        if ((
          connection.id === source.id || updateAll
        ) && connection.range) {
          cursorsModule.setCursor(
            connection.id,
            connection.range,
            getUserName(connection.user),
            connection.color,
          );
        }
        // Add to active connections hashtable
        activeConnections[connection.id] = connection;
      }
    });
    // Clear 'disconnected' cursors
    Object.keys(cursorsModule.cursors).forEach((cursorId) => {
      if (!activeConnections[cursorId]) {
        cursorsModule.removeCursor(cursorId);
      }
    });
  };

  this.debouncedSendCursorData = quill => debounce(() => {
    const range = quill.getSelection();
    if (range) {
      debugInfo('Cursors - Stopped typing, sending a cursor update/refresh.');
      localCursor.range = range;
      this.sendLocalUserCursor();
    }
  }, 1500);

  cursorsSocket.onopen = () => {
    this.sendLocalUserCursor();
  };
  cursorsSocket.onclose = (event) => {
    debugInfo(`Cursors - Socket closed. Event:${event}`);
  };
  cursorsSocket.onerror = (event) => {
    debugInfo(`Cursors - Error on socket. Event:${event}`);
  };
  cursorsSocket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    const forceLocalUserCursorUpdate = !localCursor.id;
    localCursor.id = data.id;
    if (forceLocalUserCursorUpdate) {
      this.sendLocalUserCursor();
      return;
    }

    const detail = {
      source: {},
      removedConnections: [],
    };
    // Find removed connections
    connections.forEach((connection) => {
      const testConnection = data.connections
        .find(savedConnection => savedConnection.id === connection.id);
      if (!testConnection) {
        detail.removedConnections.push(connection);
        debugInfo(`Cursors - User disconnected:${connection}`);

        // If the source connection was removed set it
        if (data.sourceId === connection) {
          detail.source = connection;
        }
      } else if (testConnection.user.login && !connection.user.login) {
        debugInfo(`Cursors - User ${testConnection.id} set username:${testConnection.user.login}`);
      }
    });

    const reportNewConnections = !(
      connections.length === 0 && data.connections.length !== 0
    );
    if (!reportNewConnections) {
      debugInfo(`Cursors - Initial list of connections received from server:${data.connections}`);
    }

    data.connections.forEach((connection) => {
      // Set the source if it's still on active connections
      if (data.sourceId === connection.id) {
        detail.source = connection;
      }

      const findConnectionCondition = savedConnection => savedConnection.id === connection.id;
      if (reportNewConnections && !connections.find(findConnectionCondition)) {
        debugInfo(`Cursors - User connected:${connection}`);
      }
    });

    connections.length = 0;
    connections.push(...data.connections);
    this.onCursorsUpdate(detail);
  };
}

export default UserCursors;
