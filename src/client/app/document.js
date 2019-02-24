// @ts-check

import ShareDB from 'sharedb/lib/client';
import RichText from 'rich-text';

import { createWebSocket } from './utils';
import { debugInfo } from './view';

function Document(documentId, socketName = 'sharedb', shareDbName = 'documents') {
  ShareDB.types.register(RichText.type);
  const shareDBConnection = new ShareDB.Connection(createWebSocket(socketName));

  const document = shareDBConnection.get(shareDbName, documentId);
  const emptyDocument = [{ insert: '\n' }];

  this.onStateChange = (callback) => {
    shareDBConnection.on('state', callback);
  };

  this.getData = () => document.data;

  this.subscribe = (callback) => {
    document.subscribe((err) => {
      if (err) {
        throw err;
      }
      if (!document.type) {
        document.create(emptyDocument, 'rich-text');
      }

      if (callback) {
        callback();
      }
    });
  };

  this.submitOperationalTransformation = (delta, source) => {
    document.submitOp(delta, { source }, (submitOpErr) => {
      if (submitOpErr) {
        debugInfo(`Submit OP returned an error: ${submitOpErr}`);
      }
    });
  };

  this.onOperationalTransformation = (callback) => {
    document.on('op', callback);
  };

  this.onNothingPending = (callback) => {
    document.on('nothing pending', callback);
  };
}

export default Document;
