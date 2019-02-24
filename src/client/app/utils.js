// @ts-check

const toString = require('lodash/toString');
const ReconnectingWebSocket = require('reconnectingwebsocket');

/**
 * Get value of 'variable' from query string
 * @param {string} query
 * @param {string} variable
 * @returns {string | null} variable value or null
 */
const getQueryVariable = (query, variable) => {
  const vars = query.substring(1).split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
};

/**
 * Get full user name string
 * @param {module:user.User} user
 * @return {string}
 */
const getUserName = user => toString(user.firstName)
  + (
    user.lastName ? ` ${user.lastName}` : ''
  );

const createWebSocket = (path) => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const { host } = window.location;
  return new ReconnectingWebSocket(`${protocol}://${host}/${path}`);
};


/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param {function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns {function} debounceFunction
 */
const debounce = (func, wait, immediate) => {
  let timeout;
  return function debounceFunction() {
    const context = this;
    const args = [func, wait, immediate];
    const later = function laterFunction() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

module.exports = {
  getQueryVariable,
  getUserName,
  createWebSocket,
  debounce,
};
