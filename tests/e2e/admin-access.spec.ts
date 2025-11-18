import { test, expect } from '@playwright/test';

test.describe('Admin Access Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página de login
    await page.goto('/auth/login');
  });

  test('debe redirigir a login si no está autenticado', async ({ page }) => {
    // Intentar acceder a /admin sin estar autenticado
    await page.goto('/admin');
    
    // Debe redirigir a login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('debe permitir acceso a admin cuando el usuario tiene rol admin', async ({ page }) => {
    // NOTA: Este test requiere que exista un usuario admin en la base de datos
    // Email y password del admin (ajustar según tu configuración)
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@materialesya.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'admin123';
    
    // Login como admin
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Esperar a que el login se complete
    await page.waitForTimeout(3000);
    
    // Obtener la sesión de Supabase desde el navegador y establecer cookies manualmente
    const sessionData = await page.evaluate(async () => {
      // Leer las variables de entorno desde window (si están disponibles) o desde el código
      // @ts-ignore
      const supabaseUrl = window.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
      // @ts-ignore  
      const supabaseKey = window.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      // Intentar obtener la sesión desde localStorage de Supabase
      const storageKey = `sb-${supabaseUrl.split('//')[1]?.split('.')[0] || 'local'}-auth-token`;
      const storedSession = localStorage.getItem(storageKey);
      
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          return {
            access_token: session.access_token,
            refresh_token: session.refresh_token
          };
        } catch (e) {
          console.error('Error parsing stored session:', e);
        }
      }
      
      // Si no encontramos en localStorage, intentar con el cliente de Supabase
      try {
        // @ts-ignore
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: { session } } = await supabase.auth.getSession();
        return session ? {
          access_token: session.access_token,
          refresh_token: session.refresh_token
        } : null;
      } catch (e) {
        console.error('Error getting session:', e);
        return null;
      }
    });
    
    // Establecer cookies manualmente en Playwright si tenemos la sesión
    if (sessionData?.access_token) {
      await page.context().addCookies([
        {
          name: 'sb-access-token',
          value: sessionData.access_token,
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax' as const
        },
        {
          name: 'sb-refresh-token',
          value: sessionData.refresh_token || sessionData.access_token,
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax' as const
        }
      ]);
      console.log('Cookies set manually in Playwright');
    }
    
    // Intentar acceder a /admin
    await page.goto('/admin', { waitUntil: 'networkidle' });
    
    // Verificar que estamos en la página de admin (no redirigido)
    await expect(page).toHaveURL(/\/admin/);
    
    // Verificar que se muestra el panel de administración
    const adminTitle = page.locator('text=Panel de Administración').first();
    await expect(adminTitle).toBeVisible({ timeout: 5000 });
    
    // Verificar que se muestran las opciones de admin
    const productsLink = page.locator('a[href="/admin/products"]');
    await expect(productsLink).toBeVisible();
    
    const ordersLink = page.locator('a[href="/admin/orders"]');
    await expect(ordersLink).toBeVisible();
  });

  test('debe redirigir a home si el usuario no tiene rol admin', async ({ page }) => {
    // NOTA: Este test requiere que exista un usuario cliente en la base de datos
    // Email y password del cliente (ajustar según tu configuración)
    const customerEmail = process.env.TEST_CUSTOMER_EMAIL || 'cliente@test.com';
    const customerPassword = process.env.TEST_CUSTOMER_PASSWORD || 'cliente123';
    
    // Login como cliente
    await page.fill('input[type="email"]', customerEmail);
    await page.fill('input[type="password"]', customerPassword);
    await page.click('button[type="submit"]');
    
    // Esperar a que el login se complete
    await page.waitForTimeout(3000);
    
    // Intentar acceder a /admin
    await page.goto('/admin', { waitUntil: 'networkidle' });
    
    // Debe redirigir a home con error de unauthorized
    await expect(page).toHaveURL(/\/\?error=unauthorized/);
  });

  test('debe mostrar el navbar con opción Admin cuando el usuario es admin', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@materialesya.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'admin123';
    
    // Login como admin
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Esperar a que el login se complete
    await page.waitForTimeout(3000);
    
    // Ir a la página principal
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Verificar que se muestra el botón de Admin en el navbar
    const adminButton = page.locator('a[href="/admin"]').or(page.locator('text=Admin')).first();
    await expect(adminButton).toBeVisible({ timeout: 5000 });
    
    // Verificar que NO se muestran las opciones de cliente (Favoritos, Mis Pedidos, etc.)
    const wishlistLink = page.locator('a[href="/wishlist"]');
    await expect(wishlistLink).not.toBeVisible();
  });

  test('debe mantener la sesión al navegar entre páginas como admin', async ({ page }) => {
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@materialesya.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'admin123';
    
    // Login como admin
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');
    
    // Esperar a que el login se complete
    await page.waitForTimeout(3000);
    
    // Verificar cookies antes de navegar
    const cookies = await page.context().cookies();
    console.log('Cookies before navigation:', cookies.map(c => c.name).join(', '));
    
    // Navegar a diferentes páginas
    await page.goto('/admin', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/admin/);
    
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL('/');
    
    await page.goto('/admin/products', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/admin\/products/);
    
    // Verificar que la sesión se mantiene (no redirige a login)
    await page.goto('/admin', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/admin/);
  });
});

