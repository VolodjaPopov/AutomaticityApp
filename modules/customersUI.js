import { expect } from "@playwright/test";
import { VALID_USER_CREDENTIALS } from "../fixtures/credentials.js";
import { PRODUCT_IMAGE } from "../fixtures/images.js";

export class CustomersUI {
  constructor(page) {
    this.page = page;
    this.product = page.locator("div[test-data='product-container']");
    this.productName = this.product.locator("h1");
    this.productImage = this.product.locator("img");
    this.addProductToCartButton = this.product.locator("button");
    this.firstProduct = this.product.nth(0);
    this.headerAfterLogin = page.locator("#app > div > div").first();
    this.button = this.headerAfterLogin.locator("button");
    this.cartButton = this.button.nth(0);
    this.logoutButton = this.button.nth(1);
    this.cartUpperWindow = page.locator("section").nth(0);
    this.clearAllItemsFromCartButton = this.cartUpperWindow.locator("button");
    this.cartWindowContents = page.locator("section").nth(1);
    this.itemInCart = this.cartWindowContents.locator("div");
    this.removeItemButton = this.itemInCart.locator("button").nth(0);
    this.filters = page.locator("ul >> nth=1 >> li");
    this.filterMenu = page.locator("ul").first();
    this.selectFiltersButton = this.filterMenu.locator("button").first();
    this.disselectFiltersButton = this.filterMenu.locator("button").last();
    this.searchBar = page.locator("#search");
    this.spinner = page.locator("svg[viewBox='0 0 100 101']").last();
    this.priceSliderStart = page.locator("span[role='slider']").first();
    this.priceSliderEnd = page.locator("span[role='slider']").last();
    this.priceFilterLi = page.locator("li >> nth=-1 >> div").nth(1);
    this.priceText = this.priceFilterLi.locator("span").nth(1);
  }

  async addProductToCart({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
    productID = 1,
  }) {
    await expect(this.product.nth(productID - 1)).toBeVisible();
    const text = await this.productName.nth(productID - 1).textContent();
    await expect(this.addProductToCartButton.nth(productID - 1)).toBeEnabled();
    const productIdLoad = this.page.waitForResponse(
      `/api/v1/cart/${userID}/products/${productID}`
    );
    await this.addProductToCartButton.nth(productID - 1).click();
    const response = await productIdLoad;
    expect(response.status()).toBe(200);
    await this.cartButton.click();
    await expect(this.cartWindowContents).toBeVisible();
    await expect(this.cartWindowContents).toContainText(text);
  }

  async removeAllProductsFromCart({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
  }) {
    await expect(this.cartButton).toBeVisible();
    await this.cartButton.click();
    await expect(this.cartUpperWindow).toBeVisible();
    await expect(this.clearAllItemsFromCartButton).toBeVisible();
    const cartIDLoad = this.page.waitForResponse(`/api/v1/cart/${userID}`);
    await this.clearAllItemsFromCartButton.click();
    const response = await cartIDLoad;
    expect(response.status()).toBe(200);
    await expect(this.cartWindowContents).toContainText(
      "No items in cart. Add some!"
    );
  }

  async removeSingleProductFromCart({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
  }) {
    const item = this.itemInCart.nth(0);
    const itemName = await item.locator(".my-1").textContent();

    const deleteButton = item.locator("button").nth(0);
    await expect(this.cartButton).toBeVisible();
    await this.cartButton.click();
    await expect(this.cartWindowContents).toBeVisible();
    await expect(item).toBeVisible();
    await expect(deleteButton).toBeVisible();
    const cartIDLoad = this.page.waitForResponse(`/api/v1/cart/${userID}`);
    await deleteButton.click();
    const response = await cartIDLoad;
    expect(response.status()).toBe(200);
    await expect(this.cartWindowContents).not.toContainText(itemName);
  }

  async apllyFilters({
    gpus_1 = false,
    cpus_2 = false,
    laptops_3 = false,
    phones_4 = false,
    peripheral_5 = false,
    cases_6 = false,
    motherboards_7 = false,
  }) {
    let filtersArr = [
      gpus_1,
      cpus_2,
      laptops_3,
      phones_4,
      peripheral_5,
      cases_6,
      motherboards_7,
    ];

    let imagesArr = [
      PRODUCT_IMAGE["GPUS_1"],
      PRODUCT_IMAGE["CPUS_2"],
      PRODUCT_IMAGE["LAPTOPS_3"],
      PRODUCT_IMAGE["PHONES_4"],
      PRODUCT_IMAGE["PERIPHERAL_5"],
      PRODUCT_IMAGE["CASES_6"],
      PRODUCT_IMAGE["MOTHERBOARDS_7"],
    ];
    let applied = [];

    for (let i = 0; i < filtersArr.length; i++) {
      if (filtersArr[i]) {
        await expect(this.filters.nth(i)).toBeVisible();
        await this.filters.nth(i).locator("a").click();
        applied.push(imagesArr[i]);
      }
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
    await expect(this.priceFilterLi).toBeVisible();
    await expect(this.priceText).toBeVisible();

    await this.priceSliderEnd.dragTo(this.priceSliderStart, {
      targetPosition: { x: 75, y: 30 },
      force: true,
    });
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
