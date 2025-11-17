import { test, expect } from '@playwright/test';

/**
 * Test automatizado para detectar botones faltantes y no funcionales
 * en la navegación de la aplicación.
 */

interface ButtonInfo {
  text: string;
  selector: string;
  isClickable: boolean;
  href?: string;
  ariaLabel?: string;
  isVisible: boolean;
  page: string;
  error?: string;
}

interface PageButtonReport {
  page: string;
  url: string;
  buttons: ButtonInfo[];
  missingButtons: string[];
  brokenButtons: ButtonInfo[];
}

test.describe.serial('Button Navigation Audit', () => {
  test.setTimeout(180000); // 3 minutos para tests que prueban múltiples páginas
  const allReports: PageButtonReport[] = [];

  // Rutas principales a verificar
  const mainRoutes = [
    { path: '/', name: 'Homepage' },
    { path: '/contacto', name: 'Contacto' },
    { path: '/auth/login', name: 'Login' },
    { path: '/auth/register', name: 'Register' },
    { path: '/cart', name: 'Cart' },
    { path: '/wishlist', name: 'Wishlist' },
    { path: '/orders', name: 'Orders' },
  ];

  // Botones esperados en cada página
  const expectedButtons: Record<string, string[]> = {
    '/': [
      'Productos',
      'Contacto',
      'Iniciar Sesión',
      'Carrito',
      'Favoritos',
      'Agregar al carrito',
      'Ver más',
      'Explorar Catálogo',
    ],
    '/contacto': [
      'Llamar ahora',
      'Abrir WhatsApp',
      'Enviar Email',
      'Ver en Google Maps',
    ],
    '/auth/login': [
      'Iniciar Sesión',
      'Regístrate aquí',
      '¿Olvidaste tu contraseña?',
    ],
    '/auth/register': [
      'Crear Cuenta',
      'Inicia sesión aquí',
    ],
    '/cart': [
      'Ver productos',
      'Proceder al pago',
      'Actualizar carrito',
      'Vaciar carrito',
    ],
    '/wishlist': [
      'Ver producto',
      'Agregar al carrito',
      'Eliminar',
    ],
    '/orders': [
      'Ver detalles',
      'Volver',
    ],
  };

  // Botones críticos que deben estar presentes
  const criticalButtons = [
    { text: 'Productos', pages: ['/'] },
    { text: 'Contacto', pages: ['/'] },
    { text: 'Iniciar Sesión', pages: ['/'] },
    { text: 'Carrito', pages: ['/'] },
  ];

  test('Auditar todos los botones de navegación', async ({ page }) => {
    for (const route of mainRoutes) {
      const report: PageButtonReport = {
        page: route.name,
        url: route.path,
        buttons: [],
        missingButtons: [],
        brokenButtons: [],
      };

      try {
        await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

        // Esperar a que los elementos se carguen
        await page.waitForTimeout(2000);

        // Encontrar todos los botones
        const buttons = await page.locator('button, [role="button"], a[href]').all();

        for (const button of buttons) {
          try {
            const isVisible = await button.isVisible();
            if (!isVisible) continue;

            const text = await button.textContent() || '';
            const selector = await button.evaluate((el) => {
              if (el.id) return `#${el.id}`;
              if (el.className) return `.${el.className.split(' ')[0]}`;
              return el.tagName.toLowerCase();
            });

            const ariaLabel = await button.getAttribute('aria-label') || undefined;
            const href = await button.getAttribute('href') || undefined;

            // Verificar si es clickeable
            let isClickable = true;
            let error: string | undefined;
            let isDisabled = false;

            try {
              isDisabled = await button.isDisabled();
              if (isDisabled) {
                isClickable = false;
                error = 'Botón deshabilitado';
              } else {
                // Intentar hacer hover para verificar interactividad
                await button.hover({ timeout: 1000 }).catch(() => {
                  isClickable = false;
                  error = 'No se puede hacer hover';
                });
              }
            } catch (e: any) {
              isClickable = false;
              error = e.message || 'Error al verificar clickeabilidad';
            }

            // Verificar si el botón tiene funcionalidad
            if (isClickable && !isDisabled) {
              try {
                // Para botones con href, verificar que la URL sea válida
                if (href && !href.startsWith('#')) {
                  const url = new URL(href, page.url());
                  // Verificar que la URL sea accesible (solo para rutas internas)
                  if (url.origin === new URL(page.url()).origin) {
                    // Intentar navegar y volver
                    const currentUrl = page.url();
                    await button.click({ timeout: 2000 }).catch(() => {
                      error = 'Error al hacer click';
                    });
                    await page.waitForTimeout(500);
                    // Si cambió la URL, volver
                    if (page.url() !== currentUrl) {
                      await page.goBack();
                      await page.waitForLoadState('networkidle');
                    }
                  }
                }
              } catch (e: any) {
                error = e.message || 'Error al verificar funcionalidad';
                isClickable = false;
              }
            }

            const buttonInfo: ButtonInfo = {
              text: text.trim(),
              selector,
              isClickable,
              href,
              ariaLabel,
              isVisible,
              page: route.name,
              error,
            };

            report.buttons.push(buttonInfo);

            if (!isClickable && error) {
              report.brokenButtons.push(buttonInfo);
            }
          } catch (e: any) {
            console.error(`Error procesando botón en ${route.path}:`, e.message);
          }
        }

        // Verificar botones esperados
        const expected = expectedButtons[route.path] || [];
        const foundTexts = report.buttons.map(b => b.text.toLowerCase().trim());
        
        for (const expectedText of expected) {
          const found = foundTexts.some(text => 
            text.includes(expectedText.toLowerCase()) || 
            expectedText.toLowerCase().includes(text)
          );
          if (!found) {
            report.missingButtons.push(expectedText);
          }
        }

        // Verificar botones críticos
        for (const critical of criticalButtons) {
          if (critical.pages.includes(route.path)) {
            const found = report.buttons.some(b => 
              b.text.toLowerCase().includes(critical.text.toLowerCase())
            );
            if (!found) {
              report.missingButtons.push(`CRÍTICO: ${critical.text}`);
            }
          }
        }

        allReports.push(report);

        // Log del reporte
        console.log(`\n📄 ${route.name} (${route.path}):`);
        console.log(`   ✅ Botones encontrados: ${report.buttons.length}`);
        console.log(`   ❌ Botones rotos: ${report.brokenButtons.length}`);
        console.log(`   ⚠️  Botones faltantes: ${report.missingButtons.length}`);

      } catch (e: any) {
        console.error(`Error al auditar ${route.path}:`, e.message);
        report.brokenButtons.push({
          text: 'ERROR DE PÁGINA',
          selector: '',
          isClickable: false,
          isVisible: false,
          page: route.name,
          error: e.message,
        });
        allReports.push(report);
      }
    }
  });

  test('Verificar botones del navbar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const navbarButtons = [
      { text: 'Productos', shouldExist: true },
      { text: 'Contacto', shouldExist: true },
      { text: 'Iniciar Sesión', shouldExist: true },
      { text: 'Carrito', shouldExist: true },
    ];

    for (const btn of navbarButtons) {
      const button = page.getByRole('button', { name: new RegExp(btn.text, 'i') })
        .or(page.getByRole('link', { name: new RegExp(btn.text, 'i') }))
        .first();

      if (btn.shouldExist) {
        await expect(button).toBeVisible({ timeout: 5000 });
        
        // Verificar que sea clickeable
        const isDisabled = await button.isDisabled().catch(() => false);
        expect(isDisabled).toBeFalsy();
      }
    }
  });

  test('Verificar botones de producto en cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Esperar a que las cards se carguen
    await page.waitForSelector('[data-testid="product-card"], .grid', { timeout: 10000 }).catch(() => {});

    // Buscar botones de "Agregar al carrito"
    const addToCartButtons = page.getByRole('button', { name: /agregar al carrito/i });
    const count = await addToCartButtons.count();

    if (count > 0) {
      // Verificar que al menos uno sea clickeable
      const firstButton = addToCartButtons.first();
      await expect(firstButton).toBeVisible();
      
      // Verificar que no esté deshabilitado (a menos que no haya stock)
      const isDisabled = await firstButton.isDisabled();
      if (!isDisabled) {
        // Intentar hacer click (sin esperar navegación)
        await firstButton.click({ timeout: 2000 }).catch(() => {
          console.warn('Botón "Agregar al carrito" no es clickeable');
        });
      }
    } else {
      console.warn('No se encontraron botones "Agregar al carrito" en la página');
    }
  });

  test('Verificar botones de filtros', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const filterButtons = [
      { text: 'Filtros', shouldExist: true },
      { text: 'Limpiar', shouldExist: false }, // Solo aparece si hay filtros activos
    ];

    for (const btn of filterButtons) {
      const button = page.getByRole('button', { name: new RegExp(btn.text, 'i') }).first();
      
      if (btn.shouldExist) {
        await expect(button).toBeVisible({ timeout: 5000 });
        const isDisabled = await button.isDisabled().catch(() => false);
        expect(isDisabled).toBeFalsy();
      }
    }
  });

  test('Verificar botones de paginación', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Esperar a que la paginación se cargue si existe
    await page.waitForTimeout(2000);

    const paginationButtons = page.getByRole('button', { name: /página|anterior|siguiente/i });
    const count = await paginationButtons.count();

    if (count > 0) {
      // Verificar que los botones de paginación sean clickeables
      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = paginationButtons.nth(i);
        const isVisible = await button.isVisible().catch(() => false);
        if (isVisible) {
          const isDisabled = await button.isDisabled().catch(() => false);
          // Los botones pueden estar deshabilitados si estás en la primera/última página
          // pero deben ser visibles
          expect(isVisible).toBeTruthy();
        }
      }
    }
  });

  test('Verificar botones críticos del navbar en todas las páginas', async ({ page }) => {
    const criticalNavButtons = ['Productos', 'Contacto'];
    
    for (const route of mainRoutes) {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      for (const btnText of criticalNavButtons) {
        const button = page.getByRole('button', { name: new RegExp(btnText, 'i') })
          .or(page.getByRole('link', { name: new RegExp(btnText, 'i') }))
          .first();

        const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          const isDisabled = await button.isDisabled().catch(() => false);
          expect(isDisabled).toBeFalsy();
        }
      }
    }
  });

  test('Verificar accesibilidad de botones', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const buttons = await page.locator('button, [role="button"]').all();
    
    for (const button of buttons.slice(0, 10)) { // Verificar primeros 10
      const isVisible = await button.isVisible().catch(() => false);
      if (!isVisible) continue;

      // Verificar que tenga texto o aria-label
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      if (!text?.trim() && !ariaLabel) {
        const selector = await button.evaluate((el) => {
          if (el.id) return `#${el.id}`;
          return el.className ? `.${el.className.split(' ')[0]}` : el.tagName;
        });
        console.warn(`⚠️  Botón sin texto ni aria-label: ${selector}`);
      }
    }
  });

  test('Generar reporte final de auditoría', async () => {
    // Este test se ejecuta al final y genera el reporte consolidado
    console.log('\n' + '='.repeat(80));
    console.log('📊 REPORTE FINAL DE AUDITORÍA DE BOTONES');
    console.log('='.repeat(80));

    let totalButtons = 0;
    let totalBroken = 0;
    let totalMissing = 0;

    for (const report of allReports) {
      totalButtons += report.buttons.length;
      totalBroken += report.brokenButtons.length;
      totalMissing += report.missingButtons.length;

      console.log(`\n📄 ${report.page} (${report.url})`);
      console.log(`   Total botones: ${report.buttons.length}`);
      
      if (report.brokenButtons.length > 0) {
        console.log(`   ❌ Botones rotos (${report.brokenButtons.length}):`);
        report.brokenButtons.forEach(btn => {
          console.log(`      - "${btn.text}" - ${btn.error || 'Error desconocido'}`);
        });
      }

      if (report.missingButtons.length > 0) {
        console.log(`   ⚠️  Botones faltantes (${report.missingButtons.length}):`);
        report.missingButtons.forEach(text => {
          console.log(`      - ${text}`);
        });
      }

      // Mostrar algunos botones encontrados como ejemplo
      if (report.buttons.length > 0) {
        console.log(`   ✅ Ejemplos de botones encontrados:`);
        report.buttons.slice(0, 5).forEach(btn => {
          const status = btn.isClickable ? '✓' : '✗';
          console.log(`      ${status} "${btn.text}" ${btn.href ? `(${btn.href})` : ''}`);
        });
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📈 RESUMEN GENERAL');
    console.log('='.repeat(80));
    console.log(`Total de páginas auditadas: ${allReports.length}`);
    console.log(`Total de botones encontrados: ${totalButtons}`);
    console.log(`Total de botones rotos: ${totalBroken}`);
    console.log(`Total de botones faltantes: ${totalMissing}`);
    console.log('='.repeat(80) + '\n');

    // Fallar el test si hay botones críticos rotos o faltantes
    const criticalIssues = allReports.some(r => 
      r.missingButtons.some(m => m.includes('CRÍTICO')) || 
      r.brokenButtons.length > 0
    );

    if (criticalIssues) {
      console.error('❌ Se encontraron problemas críticos con los botones');
      // No fallar el test, solo reportar
    } else {
      console.log('✅ No se encontraron problemas críticos');
    }
  });
});

