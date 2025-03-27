import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { CustomersUI } from "../../modules/customersUI.js";
import { AuthUI } from "../../modules/authUI.js";
import { URLS } from "../../fixtures/urls.js";

test.describe("Dasboard tests", () => {
  let page;
  let authUI;
  let customersUI;

  test.beforeAll("Log in", async ({ browser }) => {
    page = await browser.newPage();
    authUI = new AuthUI(page);
    customersUI = new CustomersUI(page);
    await page.goto(URLS["LOGIN_PAGE"]);
    await authUI.login({ valid: true });
  });

  test.afterAll("Close page", async ({}) => {
    await page.close();
  });

  test("Add a product to cart", { tag: "@smoke" }, async ({}) => {
    await page.goto(URLS["DASHBOARD"]);
    await expect(page).toHaveURL(URLS["DASHBOARD"]);
    const spinner = page.locator(
      "div:nth-child(24) > .h-screen > .absolute > .h-48 > .text-white"
    );
    await spinner.waitFor();
    await page.waitForSelector(
      "div:nth-child(24) > .h-screen > .absolute > .h-48 > .text-white",
      { state: "hidden" }
    );
    let userID = await page.evaluate(() => {
      return localStorage.getItem("userId");
    });
    await customersUI.addProductToCart({ userID: userID, productID: 20 });
  });

  test("Generic test", { tag: "@smoke" }, async ({}) => {
    await page.goto(URLS["DASHBOARD"]);
    await expect(page).toHaveURL(URLS["DASHBOARD"]);
  });
});
