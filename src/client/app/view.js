import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import filter from 'lodash/filter';

import { SHOW_DEBUG_INFO } from './config';

import { getUserName } from './utils';

if (SHOW_DEBUG_INFO) {
  const statusEl = document.getElementById('status');
  statusEl.style.display = 'block';
}

/**
 * Print to console log debug text with time stamp
 * @param {string} text
 */
export const debugInfo = (text) => {
  if (SHOW_DEBUG_INFO) {
    const timeLabel = (
      new Date()
    ).toLocaleString();
    const debugInfoText = `[${timeLabel}] ${text}`;
    // eslint-disable-next-line no-console
    console.log(debugInfoText);
  }
};

/**
 * Update or append text of status
 * @param {string} statusText - new status text
 * @param {string} debugMessage - (optional) additional debug info message
 * @param {string} color - (optional) text color
 */
export const updateStatus = (statusText, debugMessage = statusText, color = 'black') => {
  const el = document.getElementById('status');
  el.style.color = color;
  if (el) {
    el.innerText = statusText;
  }
  debugInfo(debugMessage);
};

/**
 * Update text of editor caption
 * @param {string} title - new title text
 */
export const updateCaption = (title = '') => {
  const el = document.getElementById('title');
  el.innerText = title;
};

/**
 *
 * @param {module:user.User} user
 * @param {string} color - user cursor color
 */
export const updateUser = (user, color = 'black') => {
  const el = document.getElementById('users-panel-current');
  el.innerText = getUserName(user);
  el.style.borderBottomColor = color;
};

const usersPanelEl = document.getElementById('user-panel-online');
const usersListEl = document.getElementById('users-panel-list');
export const clearUserList = () => {
  usersListEl.innerHTML = null;
};

/**
 * @param {module:cursors.CursorConnection[]} connections
 * @param {module:cursors.CursorConnection} localConnection
 */
export const updateUserList = (connections, localConnection) => {
  clearUserList();
  if (connections.length === 0) {
    return;
  }
  const uniqByUserName = uniqBy(connections, 'user.login');
  const currentUserConnection = find(
    uniqByUserName,
    connection => connection.user.login === localConnection.user.login,
  );
  const withoutCurrentUser = filter(
    uniqByUserName,
    connection => connection !== currentUserConnection,
  );
  if (currentUserConnection) {
    updateUser(currentUserConnection.user, currentUserConnection.color);
  }
  if (withoutCurrentUser.length > 0) {
    usersPanelEl.style.display = 'block';
    withoutCurrentUser.forEach((connection) => {
      const isCurrentConnection = connection.id === localConnection.id;
      if (!isCurrentConnection) {
        const userNameEl = document.createElement('div');
        userNameEl.innerHTML = getUserName(connection.user);
        userNameEl.classList.add('user-name');
        userNameEl.style.borderBottomColor = connection.color;
        usersListEl.appendChild(userNameEl);
      }
    });
  } else {
    usersPanelEl.style.display = 'none';
  }
};
