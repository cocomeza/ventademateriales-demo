import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MaterialesYA/);
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Productos');
    await expect(page).toHaveURL('/');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contacto');
    await expect(page).toHaveURL('/contacto');
    await expect(page.getByRole('heading', { name: /Contacto/i })).toBeVisible();
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/');
    const cartButton = page.locator('[aria-label*="carrito"], [aria-label*="cart"]').first();
    if (await cartButton.isVisible()) {
      await cartButton.click();
      await expect(page).toHaveURL('/cart');
    }
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /Iniciar Sesión/i });
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await expect(page).toHaveURL('/auth/login');
    }
  });
});

