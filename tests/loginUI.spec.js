import { test } from "../fixtures/basePage.js";
import { URLS } from "../fixtures/urls.js";
import { ERROR_MESSAGES } from "../fixtures/messages.js";
import { INVALID_USER_CREDENTIALS } from "../fixtures/credentials.js";

test.describe('Login tests', () => {

  test.beforeEach('Visit the login page', async ({ page }) => {
    await page.goto(URLS["LOGIN_PAGE"]);
  });

  test("Attempt to log in with no credentials of any kind", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.login({ email: "", password: "", message: ERROR_MESSAGES["EMAIL_AND_PASSWORD_BOTH_MISSING"] });
  });

  test("Attempt to log in with no password", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.login({ password: "", message: ERROR_MESSAGES["PASSWORD_MISSING"] });
  });

  test("Attempt to log in with a correct mail, but the wrong password", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.login({ password: INVALID_USER_CREDENTIALS["INCORRECT_PASSWORD_FOR_VALID_USER"], error: ERROR_MESSAGES["UNAUTHORIZED"] });
  });

  test("Attempt to log in with invalid mail format", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.login({ email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"] });
  });

  test("Attempt to log in with valid email address that has not been registered", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.login({ email: INVALID_USER_CREDENTIALS["VALID_MAIL_BUT_NOT_REGISTERED"], error: ERROR_MESSAGES["UNAUTHORIZED"] });
  });

  test("Log in", { tag: "@smoke" }, async ({ authUI }) => {
    await authUI.login({ valid: true });
  });

  test("Logout", { tag: "@smoke" }, async ({ authUI }) => {
    await authUI.login({ valid: true });
    await authUI.logout({});
  });
});
