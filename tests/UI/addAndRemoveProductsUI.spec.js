import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { CustomersUI } from "../../modules/customersUI.js";
import { AuthUI } from "../../modules/authUI.js";
import { URLS } from "../../fixtures/urls.js";

test.describe("Test regarding adding and removing products from the cart", () => {
  let page;
  let authUI;
  let customersUI;

  test.beforeAll("Log in", async ({ browser }) => {
    page = await browser.newPage();
    authUI = new AuthUI(page);
    customersUI = new CustomersUI(page);
    await page.goto(URLS["LOGIN_PAGE"]);
    await authUI.login({});
  });

  test.beforeEach(
    "Visit the dashboard page and wait for all products to load",
    async ({}) => {
      // We wait for all products to load because the tests run
      // too fast otherwise and innacurate results are recieved

      await page.goto(URLS["DASHBOARD"]);
      await expect(page).toHaveURL(URLS["DASHBOARD"]);
      await expect(customersUI.spinner).toBeVisible();
      await customersUI.spinner.waitFor({ state: "hidden" });
      for (const prod of await customersUI.product.all()) {
        await expect(prod).toBeVisible();
      }
    }
  );

  test.afterAll("Close page", async ({}) => {
    await page.close();
  });

  test("Add a product to cart", { tag: "@smoke" }, async ({}) => {
    await customersUI.addProductToCart({ productID: 16 });
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
});
