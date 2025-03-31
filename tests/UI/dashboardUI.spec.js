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
    await customersUI.addProductToCart({ productID: 7 });
  });

  test("Remove all products from cart", { tag: "@smoke" }, async ({}) => {
    await customersUI.removeAllProductsFromCart({});
  });

  test(
    "Remove a single product from cart (first product)",
    { tag: "@smoke" },
    async ({}) => {
      await customersUI.removeSingleProductFromCart({});
    }
  );

  test("Aplly filters", { tag: "@sanity" }, async ({}) => {
    await customersUI.apllyFilters({ three: true, four: true });
  });

  test("Search for a product", { tag: "@sanity" }, async ({}) => {
    await customersUI.searchForItem({ item: "apple" });
  });
});
