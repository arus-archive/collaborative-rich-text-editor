/**
 * @module user
 * @typedef {Object} module:user.User
 * @property {string} login
 * @property {string} firstName
 * @property {string} lastName
 */

/**
 * @module document
 * @typedef {Object} module:document.Document
 * @property {string} id
 * @property {string} title
 */

/**
 * @module cursors
 * @typedef {Object} module:cursors.CursorConnection
 * @property {string | null} id
 * @property {module:user.User} user
 * @property {module:document.Document} document
 * @property {string | null} color
 */
