/**
 * Application configuration variables
 * ENV - constant that injected by webpack DefinePlugin
 * @see {@link ../../config/*.webpack.config.js}
 */

// eslint-disable-next-line no-undef
export const SHOW_DEBUG_INFO = ENV.showDebugInfo;
export const TOKEN_KEY = 'token';
export const DOCUMENT_ID_KEY = 'documentId';
export const INITIALIZE_URL = '/api/initialize';
