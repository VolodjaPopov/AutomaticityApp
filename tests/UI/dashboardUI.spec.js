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
    await customersUI.addProductToCart({ productID: 23 });
  });

  test("Remove all products from cart", { tag: "@smoke" }, async ({}) => {
    await page.goto(URLS["DASHBOARD"]);
    await expect(page).toHaveURL(URLS["DASHBOARD"]);
    await customersUI.removeAllProductsFromCart({});
  });

  test("Delete a single item from cart", { tag: "@smoke" }, async ({}) => {
    await page.goto(URLS["DASHBOARD"]);
    await expect(page).toHaveURL(URLS["DASHBOARD"]);
    await customersUI.removeSingleProductFromCart({});
  });
});
