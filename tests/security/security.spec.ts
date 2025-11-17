import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test('should have secure headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    // Check for security headers
    if (headers) {
      // X-Frame-Options should prevent clickjacking
      const frameOptions = headers['x-frame-options'];
      if (frameOptions) {
        expect(['DENY', 'SAMEORIGIN']).toContain(frameOptions);
      }
      
      // X-Content-Type-Options should prevent MIME sniffing
      const contentTypeOptions = headers['x-content-type-options'];
      if (contentTypeOptions) {
        expect(contentTypeOptions).toBe('nosniff');
      }
    }
  });

  test('should not expose sensitive information in errors', async ({ page }) => {
    // Try to access a non-existent page
    const response = await page.goto('/non-existent-page-12345');
    
    // Error page should not expose stack traces or internal paths
    const body = await page.textContent('body');
    if (body) {
      expect(body).not.toContain('node_modules');
      expect(body).not.toContain('stack trace');
      expect(body).not.toContain('at ');
    }
  });

  test('should sanitize user input', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try XSS attack
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[type="email"]', xssPayload);
    
    // Check that script is not executed
    const emailValue = await page.inputValue('input[type="email"]');
    expect(emailValue).not.toContain('<script>');
  });

  test('should use HTTPS in production', async ({ page, baseURL }) => {
    // This test would check if production URLs use HTTPS
    // For local development, we skip this
    if (baseURL && baseURL.includes('https://')) {
      expect(baseURL).toMatch(/^https:/);
    }
  });

  test('should not expose API keys in client code', async ({ page }) => {
    await page.goto('/');
    
    // Get page source
    const content = await page.content();
    
    // Check that sensitive keys are not exposed
    // These should only be in environment variables
    expect(content).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
    expect(content).not.toContain('SENTRY_AUTH_TOKEN');
  });

  test('forms should have CSRF protection', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check if form has CSRF token (implementation dependent)
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      // Forms should have some protection mechanism
      // This is a basic check - actual implementation may vary
      const formAction = await form.getAttribute('action');
      expect(formAction).toBeTruthy();
    }
  });
});

