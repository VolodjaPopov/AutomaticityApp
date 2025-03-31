import { expect } from "@playwright/test";
import { VALID_USER_CREDENTIALS } from "../fixtures/credentials.js";
import { URLS } from "../fixtures/urls.js";
import { PRODUCT_IMAGE } from "../fixtures/images.js";

export class CustomersUI {
  constructor(page) {
    this.page = page;
    this.product = page.locator("div[test-data='product-container']");
    this.productName = this.product.locator("h1");
    this.productImage = this.product.locator("img");
    this.addProductToCartButton = this.product.locator("button");
    this.firstProduct = this.product.nth(0);
    this.headerAfterLogin = page.locator(".max-w-full");
    this.button = this.headerAfterLogin.locator("button");
    this.cartButton = this.button.nth(0);
    this.logoutButton = this.button.nth(1);
    this.cartUpperWindow = page.locator("section").nth(0);
    this.clearAllItemsFromCartButton = this.cartUpperWindow.locator("button");
    this.cartWindowContents = page.locator("section").nth(1);
    this.itemInCart = this.cartWindowContents.locator("div");
    this.removeItemButton = this.itemInCart.locator("button").nth(0);
    this.filters = page.locator(".p-ripple");
    this.filterMenu = page.locator("ul").first();
    this.selectFiltersButton = this.filterMenu.locator("button").first();
    this.disselectFiltersButton = this.filterMenu.locator("button").last();
    this.searchBar = page.locator("#search");
    this.spinner = page.locator(".h-screen > .absolute > .h-48").last();
    this.pageSwitchDiv = page.locator(".paginated");
    this.pageSwitchButton = this.pageSwitchDiv.locator("button");
    this.priceSliderStart = page.locator(".p-slider-handle-start");
    this.priceSliderEnd = page.locator(".p-slider-handle-end");
    this.priceSliderTrack = page.locator(".p-slider-range");
    this.priceFilterLi = page.locator(".pt-4 > div").nth(1);
    this.priceText = this.priceFilterLi.locator("span").nth(1);
  }

  async addProductToCart({
    valid = true,
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
    productID = 1,
  }) {
    await this.page.goto(URLS["DASHBOARD"]);
    await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
    await expect(this.product).toHaveCount(24);
    for (const prod of await this.product.all()) {
      await expect(prod).toBeVisible();
    }

    await expect(this.product.nth(productID - 1)).toBeVisible();
    const text = await this.productName.nth(productID - 1).textContent();
    await expect(this.addProductToCartButton.nth(productID - 1)).toBeEnabled();
    const responsePromise = this.page.waitForResponse(
      `/api/v1/cart/${userID}/products/${productID}`
    );
    await this.addProductToCartButton.nth(productID - 1).click();
    const response = await responsePromise;
    const responseJSON = await response.json();
    expect(response.status()).toBe(200);
    console.log(responseJSON);
    await this.cartButton.click();
    await expect(this.cartWindowContents).toBeVisible();
    await expect(this.cartWindowContents).toContainText(text);
  }

  async removeAllProductsFromCart({
    valid = true,
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
  }) {
    await this.page.goto(URLS["DASHBOARD"]);
    await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
    await expect(this.product).toHaveCount(24);
    for (const prod of await this.product.all()) {
      await expect(prod).toBeVisible();
    }
    await expect(this.cartButton).toBeVisible();
    await this.cartButton.click();
    await expect(this.cartUpperWindow).toBeVisible();
    await expect(this.clearAllItemsFromCartButton).toBeVisible();
    const responsePromise = this.page.waitForResponse(`/api/v1/cart/${userID}`);
    await this.clearAllItemsFromCartButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(this.cartWindowContents).toContainText(
      "No items in cart. Add some!"
    );
  }

  async removeSingleProductFromCart({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
  }) {
    await this.page.goto(URLS["DASHBOARD"]);
    await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
    await expect(this.product).toHaveCount(24);
    for (const prod of await this.product.all()) {
      await expect(prod).toBeVisible();
    }
    const item = this.itemInCart.nth(0);
    const itemName = await item.locator(".my-1").textContent();

    const deleteButton = item.locator("button").nth(0);
    await expect(this.cartButton).toBeVisible();
    await this.cartButton.click();
    await expect(this.cartWindowContents).toBeVisible();
    await expect(item).toBeVisible();
    await expect(deleteButton).toBeVisible();
    const responsePromise = this.page.waitForResponse(`/api/v1/cart/${userID}`);
    await deleteButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    await expect(this.cartWindowContents).not.toContainText(itemName);
  }

  async apllyFilters({
    one = false,
    two = false,
    three = false,
    four = false,
    five = false,
    six = false,
    seven = false,
  }) {
    await this.page.goto(URLS["DASHBOARD"]);
    await expect(this.product).toHaveCount(24);
    for (const prod of await this.product.all()) {
      await expect(prod).toBeVisible();
    }
    let applied = [];
    if (one) {
      await expect(this.filters.nth(1)).toBeVisible();
      await this.filters.nth(1).click();
      applied.push(PRODUCT_IMAGE["GPUS_1"]);
    }
    if (two) {
      await expect(this.filters.nth(2)).toBeVisible();
      await this.filters.nth(2).click();
      applied.push(PRODUCT_IMAGE["CPUS_2"]);
    }
    if (three) {
      await expect(this.filters.nth(3)).toBeVisible();
      await this.filters.nth(3).click();
      applied.push(PRODUCT_IMAGE["LAPTOPS_3"]);
    }
    if (four) {
      await expect(this.filters.nth(4)).toBeVisible();
      await this.filters.nth(4).click();
      applied.push(PRODUCT_IMAGE["PHONES_4"]);
    }
    if (five) {
      await expect(this.filters.nth(5)).toBeVisible();
      await this.filters.nth(5).click();
      applied.push(PRODUCT_IMAGE["PERIPHERAL_5"]);
    }
    if (six) {
      await expect(this.filters.nth(6)).toBeVisible();
      await this.filters.nth(6).click();
      applied.push(PRODUCT_IMAGE["CASES_6"]);
    }
    if (seven) {
      await expect(this.filters.nth(7)).toBeVisible();
      await this.filters.nth(7).click();
      applied.push(PRODUCT_IMAGE["MOTHERBOARDS_7"]);
    }
    await this.selectFiltersButton.click();

    await expect(this.spinner).toBeVisible();
    await expect(this.spinner).not.toBeVisible();
    let prodCount = 0;
    let filterCount = 0;

    for (const prod of await this.product.all()) {
      await expect(prod).toBeVisible();
      prodCount++;
      for (const element of applied) {
        let image = prod.locator("img");
        if ((await image.getAttribute("src")) == element) {
          filterCount++;
        }
      }
    }
    expect(prodCount).toEqual(filterCount);
  }

  async applyPriceFilter({}) {
    await this.page.goto(URLS["DASHBOARD"]);
    await expect(this.product).toHaveCount(24);
    for (const prod of await this.product.all()) {
      await expect(prod).toBeVisible();
    }
    await expect(this.priceFilterLi).toBeVisible();
    await expect(this.priceText).toBeVisible();

    await this.priceSliderEnd.dragTo(this.priceSliderStart, {
      targetPosition: { x: 60, y: 30 },
      force: true,
    });
    await expect(this.priceText).toContainText("€");
    const price = await this.priceText.textContent();
    const priceInt = Number(price.slice(0, -1));
    await this.selectFiltersButton.click();
    await expect(this.spinner).toBeVisible();
    await this.spinner.waitFor({ state: "hidden" });
    for (const prod of await this.product.all()) {
      const pricePerItem = await prod.locator("span").nth(1);
      const pricePerItemText = await pricePerItem.textContent();
      const pricePerItemInt = Number(pricePerItemText.slice(0, -1));
      expect(pricePerItemInt).toBeLessThanOrEqual(priceInt);
    }
  }

  async searchForItem({ item }) {
    await this.page.goto(URLS["DASHBOARD"]);
    await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
    await this.searchBar.fill(item);
    await expect(this.spinner).toBeVisible();
    await expect(this.spinner).not.toBeVisible();
    for (const prod of await this.product.all()) {
      await expect(prod.locator("h1")).toContainText(item, {
        ignoreCase: true,
      });
    }
  }
}
