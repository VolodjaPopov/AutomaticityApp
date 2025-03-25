import { test } from "../fixtures/basePage.js";
import { URLS } from "../fixtures/urls.js";
import { ERROR_MESSAGES } from "../fixtures/messages.js";
import { INVALID_USER_CREDENTIALS, VALID_USER_CREDENTIALS } from "../fixtures/credentials.js";
import { CustomersAPI } from "../modules/customersAPI.js";

test.describe('Register tests', () => {

  let userID;
  let bearerToken;
  let page;

  test.beforeAll("Make page", async({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll("Delete new users", async ({}) => {
     const customerAPI = new CustomersAPI(page);
     if (userID != null && bearerToken != null) {
     await customerAPI.delete({ userID: userID, token: bearerToken });
     }
    await page.close();
  })

  test.beforeEach('Visit the login page', async ({ page }) => {
    await page.goto(URLS["REGISTER_PAGE"]);
  });

  test("Attempt to register user with no credentials at all", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: "", email: "", password: "", message: ERROR_MESSAGES["USERNAME_EMAIL_AND_PASSWORD_ALL_MISSING"] });
  });

  test("Attempt to register user with no username", { tag: "@regression" }, async({ authUI }) => {
    await authUI.register({ username: "", message: ERROR_MESSAGES["USERNAME_MISSING"] });
  });

  test("Attempt to register with no email", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: "", message: ERROR_MESSAGES["EMAIL_MISSING"] });
  });

  test("Attempt to register with no password", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ password: "", message: ERROR_MESSAGES["PASSWORD_MISSING"] });
  });

  test("Attempt to register user with a password shorter than 6 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ password: INVALID_USER_CREDENTIALS["SHORT_PASSWORD"], message: ERROR_MESSAGES["PASSWORD_TOO_SHORT"] });
  });

  test("Attempt to register user with a username over 1000 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: INVALID_USER_CREDENTIALS["LONG_USERNAME"], message: ERROR_MESSAGES["LONG_USERNAME"] });
  });

  test("Attempt to register user with a password of 1000 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ password: INVALID_USER_CREDENTIALS["LONG_PASSWORD"] });
  });

  test("Attempt to register a user with an email of over 1000 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["LONG_EMAIL"] });
  });

  test("Attempt to register user with an invalid mail", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"] });
  });

  test("Attempt to register an aleady registered user", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: VALID_USER_CREDENTIALS["VALID_USERNAME"], email: VALID_USER_CREDENTIALS["VALID_EMAIL"], password: VALID_USER_CREDENTIALS["VALID_PASSWORD"], message: ERROR_MESSAGES["USER_ALREADY_EXISTS"] });
  });

  test("Attempt to register user with an already existing username", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: VALID_USER_CREDENTIALS["VALID_USERNAME"], message: ERROR_MESSAGES["TAKEN_USERNAME"] });
  });

  test("Attempt to register user with an already registered mail", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: VALID_USER_CREDENTIALS["VALID_EMAIL"], message: ERROR_MESSAGES["TAKEN_EMAIL"] });
  });

  test("Register", { tag: "@smoke" }, async ({ authUI }) => {
    const response = await authUI.register({ valid: true });
    userID = response.user.id;
    bearerToken = response.auth.token;
  });
});
