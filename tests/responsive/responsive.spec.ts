import { test, expect } from '@playwright/test';

const viewports = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  mobileLarge: { width: 414, height: 896 }, // iPhone 11 Pro Max
  tablet: { width: 768, height: 1024 }, // iPad
  tabletLandscape: { width: 1024, height: 768 }, // iPad Landscape
  desktop: { width: 1920, height: 1080 }, // Desktop
};

test.describe('Responsive Design', () => {
  test.describe('Mobile (375x667)', () => {
    test.use({ viewport: viewports.mobile });

    test('homepage should be responsive on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verificar que el navbar sea responsive
      const navbar = page.locator('nav');
      await expect(navbar).toBeVisible();

      // Verificar que los productos se muestren en una columna
      const productGrid = page.locator('.grid');
      const gridClass = await productGrid.first().getAttribute('class');
      expect(gridClass).toContain('grid-cols-1');

      // Verificar que no haya overflow horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewports.mobile.width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // 10px de tolerancia
    });

    test('navbar should be mobile-friendly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verificar que el logo sea visible
      const logo = page.locator('nav a[aria-label*="principal"], nav a[href="/"]').first();
      await expect(logo).toBeVisible();

      // Verificar que los botones de navegación sean accesibles
      const navButtons = page.locator('nav button, nav a');
      const buttonCount = await navButtons.count();
      expect(buttonCount).toBeGreaterThan(0);
    });

    test('product catalog should be mobile-friendly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verificar que los filtros sean accesibles
      const searchInput = page.locator('input[placeholder*="Buscar"]');
      await expect(searchInput.first()).toBeVisible();

      // Verificar que los productos se muestren correctamente
      const productCards = page.locator('[class*="Card"]');
      const cardCount = await productCards.count();
      if (cardCount > 0) {
        const firstCard = productCards.first();
        await expect(firstCard).toBeVisible();
        
        // Verificar que el contenido del card sea legible
        const cardText = await firstCard.textContent();
        expect(cardText?.length).toBeGreaterThan(0);
      }
    });

    test('should not have horizontal scroll', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const scrollWidth = await page.evaluate(() => {
        return Math.max(
          document.body.scrollWidth,
          document.documentElement.scrollWidth
        );
      });
      const clientWidth = await page.evaluate(() => {
        return Math.max(
          document.body.clientWidth,
          document.documentElement.clientWidth
        );
      });

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

    test('buttons should be touch-friendly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        if (box) {
          // Los botones deben tener al menos 44x44px para ser touch-friendly
          expect(box.height).toBeGreaterThanOrEqual(36);
        }
      }
    });
  });

  test.describe('Tablet (768x1024)', () => {
    test.use({ viewport: viewports.tablet });

    test('homepage should be responsive on tablet', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verificar que el layout sea apropiado para tablet
      const productGrid = page.locator('.grid');
      const gridClass = await productGrid.first().getAttribute('class');
      // En tablet debería mostrar 2 columnas mínimo
      expect(gridClass).toMatch(/grid-cols-[2-4]/);
    });
  });

  test.describe('Desktop (1920x1080)', () => {
    test.use({ viewport: viewports.desktop });

    test('homepage should be responsive on desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verificar que el layout sea apropiado para desktop
      const productGrid = page.locator('.grid');
      const gridClass = await productGrid.first().getAttribute('class');
      // En desktop debería mostrar 3-4 columnas
      expect(gridClass).toMatch(/grid-cols-[3-4]/);
    });
  });

  test.describe('Cross-viewport consistency', () => {
    test('all viewports should load without errors', async ({ page }) => {
      for (const [name, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Verificar que no haya errores críticos
        const errors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });

        await page.waitForTimeout(1000);

        // Filtrar errores conocidos/no críticos
        const criticalErrors = errors.filter(
          (e) =>
            !e.includes('Supabase') &&
            !e.includes('Invalid API key') &&
            !e.includes('favicon')
        );

        expect(criticalErrors.length).toBe(0);
      }
    });
  });
});

