import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page title is correct
  await expect(page).toHaveTitle(/MaterialesYA/);
  
  // Check that the main heading is visible
  await expect(page.getByRole('heading', { name: /Materiales de Construcción/i })).toBeVisible();
});

test('cart page loads', async ({ page }) => {
  await page.goto('/cart');
  
  // Check that cart page loads
  await expect(page.getByRole('heading', { name: /Carrito de Compras/i })).toBeVisible();
});

test('login page loads', async ({ page }) => {
  await page.goto('/auth/login');
  
  // Check that login form is visible
  await expect(page.getByRole('heading', { name: /Iniciar Sesión/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/contraseña/i)).toBeVisible();
});

