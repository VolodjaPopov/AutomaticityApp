import { expect } from "@playwright/test";
import { VALID_USER_CREDENTIALS } from "../fixtures/credentials.js";
import { URLS } from "../fixtures/urls.js";
import { generateUserCredentials } from "../generalFunctions/functions.js";
import { ERROR_MESSAGES } from "../fixtures/messages.js";

const { username1, email1, password1 } = generateUserCredentials(5);

export class AuthUI {
  constructor(page) {
    this.page = page;
    this.username = page.locator("#username");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.submitButton = page.locator("button");
    this.h1Banner = page.locator("h1");
    this.loginErrorMessage = page.locator("p");
    this.header = page.locator("#app > div > div").first();
    this.button = this.header.locator("button");
    this.cartButton = this.button.nth(0);
    this.logoutButton = this.button.nth(1);
    this.logoutDropdownButton = this.button.nth(2);
    this.searchBar = page.locator("#search");
  }

  async login({
    email = VALID_USER_CREDENTIALS["VALID_EMAIL"],
    password = VALID_USER_CREDENTIALS["VALID_PASSWORD"],
    message,
    valid = true,
  }) {
    expect(this.header).toBeVisible();
    expect(this.h1Banner).toBeVisible();
    expect(this.h1Banner).toContainText("Welcome Back! 👋🏻");
    expect(this.email).toBeEditable();
    await this.email.fill(email);
    expect(this.password).toBeEditable();
    await this.password.fill(password);
    expect(this.submitButton).toBeEnabled();
    const responsePromise = this.page.waitForResponse("/api/v1/auth/login");
    await this.submitButton.click();
    const response = await responsePromise;

    if (valid) {
      expect(response.status()).toBe(200);
      await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
      let token = await this.page.evaluate(() => {
        return localStorage.getItem("token");
      });
      expect(token).not.toBe(null);
    }

    if (!valid) {
      expect(response.status()).not.toBe(200);
      let responseJSON = await response.json();
      await expect(this.page).toHaveURL(URLS["LOGIN_PAGE"]);
      await expect(this.h1Banner).toBeVisible();

      if (response.status() == 401) {
        await expect(this.loginErrorMessage).toBeVisible();
        await expect(this.loginErrorMessage).toContainText(
          ERROR_MESSAGES["EMAIL_OR_PASS_INVALID"]
        );
      }

      if (response.status() == 422) {
        if (Object.keys(responseJSON.errors).length == 2) {
          await expect(this.loginErrorMessage.nth(0)).toBeVisible();
          await expect(this.loginErrorMessage.nth(0)).toContainText(
            ERROR_MESSAGES["EMAIL_MISSING"]
          );
          await expect(this.loginErrorMessage.nth(1)).toBeVisible();
          await expect(this.loginErrorMessage.nth(1)).toContainText(
            ERROR_MESSAGES["PASSWORD_MISSING"]
          );
        } else {
          await expect(this.loginErrorMessage).toBeVisible();
          await expect(this.loginErrorMessage).toContainText(message);
        }
      }
    }
  }

  async register({
    username = username1,
    email = email1,
    password = password1,
    message,
    valid = true,
    err1,
    err2,
  }) {
    expect(this.h1Banner).toBeVisible();
    expect(this.h1Banner).toContainText("Register!");
    expect(this.username).toBeEditable();
    await this.username.fill(username);
    expect(this.email).toBeEditable();
    await this.email.fill(email);
    expect(this.password).toBeEditable();
    await this.password.fill(password);
    expect(this.submitButton).toBeEnabled();
    const responsePromise = this.page.waitForResponse("/api/v1/auth/register");
    await this.submitButton.click();
    const response = await responsePromise;
    let responseJSON = await response.json();

    if (valid) {
      expect(response.status()).toBe(200);
      await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
      let token = await this.page.evaluate(() => {
        return localStorage.getItem("token");
      });
      expect(token).not.toBe(null);
    }

    if (!valid) {
      try {
        responseJSON = await response.json();
        await expect(this.page).toHaveURL(URLS["REGISTER_PAGE"]);
        await expect(this.h1Banner).toBeVisible();
        await expect(this.searchBar).not.toBeVisible();
        expect(response.status()).not.toBe(200);
      } catch (err) {
        return responseJSON;
      }

      if (response.status() == 422) {
        if (Object.keys(responseJSON.errors).length == 3) {
          expect(this.loginErrorMessage.nth(0)).toBeVisible();
          expect(this.loginErrorMessage.nth(0)).toContainText(
            ERROR_MESSAGES["USERNAME_MISSING"]
          );
          expect(this.loginErrorMessage.nth(1)).toBeVisible();
          expect(this.loginErrorMessage.nth(1)).toContainText(
            ERROR_MESSAGES["EMAIL_MISSING"]
          );
          expect(this.loginErrorMessage.nth(2)).toBeVisible();
          expect(this.loginErrorMessage.nth(2)).toContainText(
            ERROR_MESSAGES["PASSWORD_MISSING"]
          );
        }
        if (Object.keys(responseJSON.errors).length == 2) {
          expect(this.loginErrorMessage.nth(0)).toBeVisible();
          expect(this.loginErrorMessage.nth(0)).toContainText(err1);
          expect(this.loginErrorMessage.nth(1)).toBeVisible();
          expect(this.loginErrorMessage.nth(1)).toContainText(err2);
        }

        if (Object.keys(responseJSON.errors).length == 1) {
          expect(this.loginErrorMessage).toBeVisible();
          expect(this.loginErrorMessage).toContainText(message);
        }
      }
    }
    return responseJSON;
  }

  async logout({}) {
    await expect(this.header).toBeVisible();
    expect(this.logoutButton).toBeEnabled();
    await this.logoutButton.click();
    expect(this.logoutDropdownButton).toBeVisible();
    const responsePromise = this.page.waitForResponse("/");
    await this.logoutDropdownButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(this.page).toHaveURL("/");
    let token = await this.page.evaluate(() => {
      return localStorage.getItem("token");
    });
    expect(token).toBe(null);
  }
}
