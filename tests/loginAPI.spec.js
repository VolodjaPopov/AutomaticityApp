import { test } from '../fixtures/basePage.js';
import { INVALID_USER_CREDENTIALS } from '../fixtures/credentials.js';
import { ERROR_MESSAGES } from '../fixtures/messages.js';

test.describe("Login API tests", () => {
  
  test("Attempt to log in with no credentials of any kind", { tag: "@regression" }, async ({ authAPI }) => {
    await authAPI.login({ email: "", password: "", statusCode: 422, message: ERROR_MESSAGES["EMAIL_AND_PASSWORD_BOTH_MISSING"] });
  });

  test("Attempt to log in with no password", { tag: "@regression" }, async ({ authAPI }) => {
    await authAPI.login({ password: "", statusCode: 422, message: ERROR_MESSAGES["PASSWORD_MISSING"] });
  });

  test("Attempt to log in with a correct mail, but the wrong password", { tag: "@regression" }, async ({ authAPI }) => {
    await authAPI.login({ password: INVALID_USER_CREDENTIALS["INCORRECT_PASSWORD_FOR_VALID_USER"], statusCode: 401, error: ERROR_MESSAGES["UNAUTHORIZED"] });
  });

  test("Attempt to log in with invalid mail format", { tag: "@regression" }, async ({ authAPI }) => {
    await authAPI.login({ email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"], statusCode: 422, message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"] });
  });

  test("Attempt to log in with valid email address that has not been registered", { tag: "@regression" }, async ({ authAPI }) => {
    await authAPI.login({ email: INVALID_USER_CREDENTIALS["VALID_MAIL_BUT_NOT_REGISTERED"], statusCode: 401, error: ERROR_MESSAGES["UNAUTHORIZED"] });
  });
  
  test("Attempt to log in using invalid methods", { tag: "@regression" }, async ({ authAPI }) => {
    await authAPI.login({ method: "get", statusCode: 405, error: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
    await authAPI.login({ method: "put", statusCode: 405, error: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
    await authAPI.login({ method: "patch", statusCode: 405, error: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
    await authAPI.login({ method: "delete", statusCode: 405, error: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
  });

  test('Succesful login with valid credentials', { tag: "@smoke" }, async ({ authAPI }) => {
       await authAPI.login({});
      });
});
