/**
 * @module api
 */

/**
 * Authorization request result
 * @typedef {Object} InitializeResult
 * @property {string} status
 * @property {string} debug
 * @property {module:user.User} user
 * @property {module:document.Document} document
 */

import axios from 'axios';

import { INITIALIZE_URL } from '../config';

class InitializeError extends Error {
  constructor(status, debug) {
    super();
    this.status = status;
    this.debug = debug;
  }
}

/**
 * Collaboration document initialization request
 * @param token - user session token
 * @param documentId - document unique id
 * @returns {Promise<AuthResult>}
 */
export default (token, documentId) => new Promise((resolve, reject) => {
  axios.post(INITIALIZE_URL, {
    body: {
      token,
      documentId,
    },
  }).then((response) => {
    if (response.status === 200) {
      const {
        user,
        document,
        status,
        message,
      } = response.data;
      if (status === 'success') {
        const userDebugString = `user: ${JSON.stringify(user)}`;
        const documentDebugString = `document: ${JSON.stringify(document)}`;
        const debugMessage = `Initialized successfully (${userDebugString}, ${documentDebugString}, status: ${status}, message: ${message})`;
        resolve({
          status,
          message,
          debug: debugMessage,
          user,
          document: {
            ...document,
            id: documentId,
          },
        });
      } else {
        reject(new InitializeError('Authorization error',
          `Initialization error (status: ${status}, message: ${message})`));
      }
    } else {
      reject(new InitializeError('Initialization denied'));
    }
  }).catch((error) => {
    reject(new InitializeError('Initialization error', `Initialization error (${error})`));
  });
});
