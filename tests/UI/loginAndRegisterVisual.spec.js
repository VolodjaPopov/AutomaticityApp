import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { URLS } from "../../fixtures/urls.js";
import { SCREENSHOTS } from "../../fixtures/images.js";

test.describe("Visual login tests", () => {
  test("Login a new user", async ({ authUI, page }) => {
    page.goto(URLS["LOGIN_PAGE"]);
    await expect(page).toHaveScreenshot(SCREENSHOTS["LOGIN_PAGE"]);
    await authUI.login({});
    await expect(page).toHaveURL(URLS["DASHBOARD"]);
    await expect(page).toHaveScreenshot(SCREENSHOTS["DASHBOARD"]);
  });

  test("Register a new user", async ({ authUI, page, customersAPI }) => {
    page.goto(URLS["REGISTER_PAGE"]);
    await expect(page).toHaveScreenshot(SCREENSHOTS["REGISTER_PAGE"]);
    const response = await authUI.register({});
    await expect(page).toHaveURL(URLS["DASHBOARD"]);
    await expect(page).toHaveScreenshot(SCREENSHOTS["DASHBOARD"]);
    await customersAPI.delete({
      userID: response.user.id,
      token: response.auth.token,
    });
  });
});
