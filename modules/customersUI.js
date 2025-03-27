import { expect } from "@playwright/test";

export class CustomersUI {
  constructor(page) {
    this.page = page;
    this.product = page.locator("div[test-data='product-container']");
    this.productName = this.product.locator("h1");
    this.addProductToCartButton = this.product.locator("button");
    this.firstProduct = this.product.nth(0);
    this.headerAfterLogin = page.locator(".max-w-full");
    this.button = this.headerAfterLogin.locator("button");
    this.cartButton = this.button.nth(0);
    this.logoutButton = this.button.nth(1);
    this.cardWindowContents = page.locator("section").nth(1);
  }

  async addProductToCart({ valid = true, userID, productID = 1 }) {
    await expect(this.firstProduct).toBeVisible();
    await expect(this.addProductToCartButton.nth(0)).toBeEnabled();
    const responsePromise = this.page.waitForResponse(
      `/api/v1/cart/${userID}/products/${productID}`
    );
    await this.addProductToCartButton.nth(0).click();
    const response = await responsePromise;
    const responseJSON = await response.json();
    expect(response.status()).toBe(200);
    console.log(responseJSON);
    await this.cartButton.click();
    await expect(this.cardWindowContents).toBeVisible();
    await expect(this.cardWindowContents).toContainText(
      "NVIDIA GeForce RTX 3080 Ti"
    );
  }
}
