import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    if (lcp) {
      // LCP should be under 2.5 seconds
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should not have too many DOM nodes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
    // Should have reasonable number of DOM nodes (less than 2000)
    expect(nodeCount).toBeLessThan(2000);
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Check if images have loading="lazy" attribute
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute('loading');
      // Images should have lazy loading or be above the fold
      expect(loading === 'lazy' || i < 2).toBeTruthy();
    }
  });

  test('should have reasonable bundle size', async ({ page }) => {
    await page.goto('/');
    
    const response = await page.goto('/');
    const contentLength = response?.headers()['content-length'];
    
    if (contentLength) {
      const sizeInKB = parseInt(contentLength) / 1024;
      // HTML should be reasonable size (less than 500KB)
      expect(sizeInKB).toBeLessThan(500);
    }
  });
});

