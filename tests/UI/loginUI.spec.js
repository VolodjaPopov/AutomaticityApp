import { test } from "../../fixtures/basePage.js";
import { URLS } from "../../fixtures/urls.js";
import { ERROR_MESSAGES } from "../../fixtures/messages.js";
import { INVALID_USER_CREDENTIALS } from "../../fixtures/credentials.js";

test.describe("Login UI tests", () => {
  test.beforeEach("Visit the login page", async ({ page }) => {
    await page.goto(URLS["LOGIN_PAGE"]);
  });

  test(
    "Attempt to log in with no credentials of any kind",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: "",
        password: "",
        message: ERROR_MESSAGES["EMAIL_AND_PASSWORD_BOTH_MISSING"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with no password",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        password: "",
        message: ERROR_MESSAGES["PASSWORD_MISSING"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with no email",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: "",
        message: ERROR_MESSAGES["EMAIL_MISSING"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with a correct mail, but the wrong password",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        password: INVALID_USER_CREDENTIALS["INCORRECT_PASSWORD_FOR_VALID_USER"],
        error: ERROR_MESSAGES["UNAUTHORIZED"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with mail that has no @ symbol",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"],
        message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with mail that has no .com at the end",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["MAIL_WITH_NO_DOT_COM"],
        message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with mail that has nothing before @",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["MAIL_WITH_NOTHING_BEFORE_AT"],
        message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with mail that has only @",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["MAIL_WITH_ONLY_AT"],
        message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with mail that has only .com",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["MAIL_WITH_ONLY_DOT_COM"],
        message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with mail that has .com in the middle",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["MAIL_WITH_DOT_COM_IN_THE_MIDDLE"],
        message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_LOGIN"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to log in with valid email address that has not been registered",
    { tag: "@regression" },
    async ({ authUI }) => {
      await authUI.login({
        email: INVALID_USER_CREDENTIALS["VALID_MAIL_BUT_NOT_REGISTERED"],
        error: ERROR_MESSAGES["UNAUTHORIZED"],
        valid: false,
      });
    }
  );

  test("Log in", { tag: "@smoke" }, async ({ authUI }) => {
    await authUI.login({});
  });

  test("Logout", { tag: "@smoke" }, async ({ authUI }) => {
    await authUI.login({});
    await authUI.logout({});
  });
});
