import { test } from "../fixtures/basePage.js";
import { URLS } from "../fixtures/urls.js";
import { ERROR_MESSAGES } from "../fixtures/messages.js";
import { INVALID_USER_CREDENTIALS, VALID_USER_CREDENTIALS } from "../fixtures/credentials.js";
import { CustomersAPI } from "../modules/customersAPI.js";

test.describe("Register UI tests", () => {

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

  test.beforeEach("Visit the register page", async ({ page }) => {
    await page.goto(URLS["REGISTER_PAGE"]);
  });

  test("Attempt to register user with no credentials at all", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: "", email: "", password: "", message: ERROR_MESSAGES["USERNAME_EMAIL_AND_PASSWORD_ALL_MISSING"], valid: false });
  });

  test("Attempt to register user with no username", { tag: "@regression" }, async({ authUI }) => {
    await authUI.register({ username: "", message: ERROR_MESSAGES["USERNAME_MISSING"], valid: false });
  });

  test("Attempt to register with no email", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: "", message: ERROR_MESSAGES["EMAIL_MISSING"], valid: false });
  });

  test("Attempt to register with no password", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ password: "", message: ERROR_MESSAGES["PASSWORD_MISSING"], valid: false });
  });

  test("Attempt to register with no username or password", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: "", password: "", err1: ERROR_MESSAGES["USERNAME_MISSING"], err2: ERROR_MESSAGES["PASSWORD_MISSING"], valid: false });
  });

  test("Attempt to register with no username or email", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: "", email: "", err1: ERROR_MESSAGES["USERNAME_MISSING"], err2: ERROR_MESSAGES["EMAIL_MISSING"], valid: false });
  });

  test("Attempt to register with no email or password", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: "", password: "", err1: ERROR_MESSAGES["EMAIL_MISSING"], err2: ERROR_MESSAGES["PASSWORD_MISSING"], valid: false });
  });

  test("Attempt to register user with a username of 1 character", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: INVALID_USER_CREDENTIALS["ONE_CHARACTER_USERNAME"], valid: false });
  });

  test("Attempt to register user with a username over 1000 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: INVALID_USER_CREDENTIALS["LONG_USERNAME"], message: ERROR_MESSAGES["LONG_USERNAME"], valid: false });
  });

  test("Attempt to register user with an already existing username", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: VALID_USER_CREDENTIALS["VALID_USERNAME"], message: ERROR_MESSAGES["TAKEN_USERNAME"], valid: false });
  });

  test("Attempt to register a user with an email of over 1000 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["LONG_EMAIL"], valid: false });
  });

  test("Attempt to register with mail that has no @ symbol", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register with mail that has no .com at the end", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["MAIL_WITH_NO_DOT_COM"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register with mail that has nothing before @", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["MAIL_WITH_NOTHING_BEFORE_AT"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register with mail that has only @", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["MAIL_WITH_ONLY_AT"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register with mail that has only .com", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["MAIL_WITH_ONLY_DOT_COM"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register with mail that has .com in the middle", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["MAIL_WITH_DOT_COM_IN_THE_MIDDLE"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register with an email that has a single chatacter followed by many empty spaces", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: INVALID_USER_CREDENTIALS["MAIL_WITH_EMPTY_SPACES_AFTER_FIRST_CHARACTER"], message: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"], valid: false });
  });

  test("Attempt to register user with an already registered mail", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ email: VALID_USER_CREDENTIALS["VALID_EMAIL"], message: ERROR_MESSAGES["TAKEN_EMAIL"], valid: false });
  });

  test("Attempt to register user with a password shorter than 6 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ password: INVALID_USER_CREDENTIALS["SHORT_PASSWORD"], message: ERROR_MESSAGES["PASSWORD_TOO_SHORT"], valid: false });
  });

  test("Attempt to register user with a password of 1000 characters", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ password: INVALID_USER_CREDENTIALS["LONG_PASSWORD"], valid: false });
  });

  test("Attempt to register an aleady registered user", { tag: "@regression" }, async ({ authUI }) => {
    await authUI.register({ username: VALID_USER_CREDENTIALS["VALID_USERNAME"], email: VALID_USER_CREDENTIALS["VALID_EMAIL"], password: VALID_USER_CREDENTIALS["VALID_PASSWORD"], message: ERROR_MESSAGES["USER_ALREADY_EXISTS"], valid: false });
  });

  test("Register", { tag: "@smoke" }, async ({ authUI }) => {
    const response = await authUI.register({});
    userID = response.user.id;
    bearerToken = response.auth.token;
  });
});
