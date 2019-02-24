// @ts-check

const utils = require('./utils');

test('getQueryVariableTest', () => {
  const variableName = 'test';
  const variableValue = 'testValue';
  const query = `https://domain.com?wrongVariable=wrongValue&${variableName}=${variableValue}`;
  expect(utils.getQueryVariable(query, variableName)).toBe(variableValue);
});

test('getUserName', () => {
  /**
   * @type {module:user.User}
   */
  const user = {
    login: 'j-smith',
    firstName: 'John',
    lastName: 'Smith',
  };
  const expectedUserName = 'John Smith';
  expect(utils.getUserName(user)).toBe(expectedUserName);
});
