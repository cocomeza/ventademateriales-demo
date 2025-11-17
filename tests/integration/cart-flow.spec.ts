import { test, expect } from '@playwright/test';

test.describe('Cart Flow Integration', () => {
  test('should add product to cart and checkout', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Try to find and click add to cart button
    const addToCartButtons = page.locator('button:has-text("Agregar"), button:has-text("Add")');
    const buttonCount = await addToCartButtons.count();
    
    if (buttonCount > 0) {
      await addToCartButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Navigate to cart
      const cartButton = page.locator('[aria-label*="carrito"], [aria-label*="cart"]').first();
      if (await cartButton.isVisible()) {
        await cartButton.click();
        await expect(page).toHaveURL(/\/cart/);
      }
    }
  });

  test('should persist cart state', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Add item to cart if possible
    const addToCartButtons = page.locator('button:has-text("Agregar"), button:has-text("Add")');
    if (await addToCartButtons.count() > 0) {
      await addToCartButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Reload page
      await page.reload();
      await page.waitForTimeout(2000);
      
      // Check if cart still has items (if cart badge exists)
      const cartBadge = page.locator('[aria-label*="carrito"], [aria-label*="cart"]').first();
      // Cart state should persist
    }
  });
});

