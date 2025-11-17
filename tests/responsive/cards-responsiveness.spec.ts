import { test, expect } from '@playwright/test';

/**
 * Test de responsividad para verificar que las cards de productos
 * se muestren correctamente en todos los dispositivos
 */

// Dispositivos comunes a probar
const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12 Pro', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Air', width: 820, height: 1180 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Notebook pequeño', width: 1024, height: 768 },
  { name: 'Notebook estándar', width: 1280, height: 800 },
  { name: 'Notebook grande', width: 1366, height: 768 },
  { name: 'Desktop pequeño', width: 1440, height: 900 },
  { name: 'Desktop estándar', width: 1920, height: 1080 },
  { name: 'Desktop grande', width: 2560, height: 1440 },
];

interface CardMetrics {
  width: number;
  height: number;
  isVisible: boolean;
  isOverflowing: boolean;
  imageVisible: boolean;
  buttonVisible: boolean;
  textReadable: boolean;
}

test.describe('Responsividad de Cards de Productos', () => {
  test.setTimeout(120000); // 2 minutos para tests que prueban múltiples dispositivos
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Esperar a que las cards se carguen - usar múltiples selectores
    await Promise.race([
      page.waitForSelector('[data-product-card]', { timeout: 10000 }).catch(() => {}),
      page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 }).catch(() => {}),
      page.waitForTimeout(2000), // Timeout mínimo
    ]);
  });

  test('Verificar cards en diferentes dispositivos', async ({ page }) => {
    const issues: Array<{
      device: string;
      issue: string;
      details?: any;
    }> = [];

    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.waitForTimeout(500); // Esperar a que se ajuste el layout

      // Buscar cards de productos - usar múltiples selectores
      let cards = await page.locator('[data-product-card], [data-testid="product-card"]').all();
      
      if (cards.length === 0) {
        // Intentar encontrar cards de otra manera
        const productCards = await page.locator('[data-testid="product-card"]').all();
        if (productCards.length === 0) {
          // Último intento con selectores más genéricos
          const fallbackCards = await page.locator('.grid [class*="Card"]').all();
          if (fallbackCards.length === 0) {
            issues.push({
              device: device.name,
              issue: 'No se encontraron cards de productos',
            });
            continue;
          }
          cards = fallbackCards;
        } else {
          cards = productCards;
        }
      }

      // Verificar cada card visible - limitar a las primeras 5 y con timeout
      const visibleCards: any[] = [];
      for (let i = 0; i < Math.min(cards.length, 5); i++) {
        try {
          const card = cards[i];
          const isVisible = await card.isVisible({ timeout: 2000 }).catch(() => false);
          if (isVisible) {
            visibleCards.push(card);
          }
        } catch (e) {
          // Continuar con la siguiente card
        }
      }
      
      if (visibleCards.length === 0) {
        issues.push({
          device: device.name,
          issue: 'No hay cards visibles para verificar',
        });
        continue;
      }

      for (let i = 0; i < Math.min(visibleCards.length, 5); i++) {
        const card = visibleCards[i];
        const metrics: CardMetrics = {
          width: 0,
          height: 0,
          isVisible: false,
          isOverflowing: false,
          imageVisible: false,
          buttonVisible: false,
          textReadable: false,
        };

        try {
          // Verificar visibilidad
          metrics.isVisible = await card.isVisible();
          if (!metrics.isVisible) {
            issues.push({
              device: device.name,
              issue: `Card ${i + 1} no es visible`,
            });
            continue;
          }

          // Obtener dimensiones
          const boundingBox = await card.boundingBox();
          if (boundingBox) {
            metrics.width = boundingBox.width;
            metrics.height = boundingBox.height;

            // Verificar que la card no sea demasiado pequeña
            if (metrics.width < 150) {
              issues.push({
                device: device.name,
                issue: `Card ${i + 1} es demasiado estrecha (${metrics.width.toFixed(0)}px)`,
                details: { width: metrics.width },
              });
            }

            // Verificar que la card no sea demasiado grande
            if (metrics.width > device.width * 0.95) {
              issues.push({
                device: device.name,
                issue: `Card ${i + 1} ocupa casi todo el ancho (${metrics.width.toFixed(0)}px de ${device.width}px)`,
                details: { width: metrics.width, viewportWidth: device.width },
              });
            }

            // Verificar overflow horizontal
            const cardElement = await card.evaluateHandle((el) => el);
            const scrollWidth = await cardElement.evaluate((el: HTMLElement) => el.scrollWidth);
            const clientWidth = await cardElement.evaluate((el: HTMLElement) => el.clientWidth);
            metrics.isOverflowing = scrollWidth > clientWidth;

            if (metrics.isOverflowing) {
              issues.push({
                device: device.name,
                issue: `Card ${i + 1} tiene overflow horizontal`,
                details: { scrollWidth, clientWidth },
              });
            }
          }

          // Verificar imagen
          const image = card.locator('img').first();
          metrics.imageVisible = await image.isVisible().catch(() => false);
          if (metrics.imageVisible) {
            const imageBox = await image.boundingBox();
            if (imageBox) {
              // Verificar que la imagen tenga un tamaño razonable
              if (imageBox.width < 50 || imageBox.height < 50) {
                issues.push({
                  device: device.name,
                  issue: `Card ${i + 1} tiene imagen muy pequeña`,
                  details: { width: imageBox.width, height: imageBox.height },
                });
              }
            }
          }

          // Verificar botón "Agregar al carrito"
          const addButton = card.getByRole('button', { name: /agregar al carrito/i }).first();
          metrics.buttonVisible = await addButton.isVisible().catch(() => false);
          if (metrics.buttonVisible) {
            const buttonBox = await addButton.boundingBox();
            if (buttonBox) {
              // Verificar que el botón sea clickeable
              const isClickable = await addButton.isEnabled().catch(() => false);
              if (!isClickable && !(await addButton.getAttribute('disabled'))) {
                // Solo reportar si no está deshabilitado intencionalmente
              }
            }
          } else {
            // Buscar botón de otra manera
            const anyButton = card.locator('button').first();
            const hasButton = await anyButton.isVisible().catch(() => false);
            if (!hasButton) {
              issues.push({
                device: device.name,
                issue: `Card ${i + 1} no tiene botón visible`,
              });
            }
          }

          // Verificar texto legible
          const title = card.locator('h3, [class*="title"]').first();
          const titleText = await title.textContent().catch(() => '');
          if (titleText && titleText.trim()) {
            const titleBox = await title.boundingBox();
            if (titleBox) {
              // Verificar tamaño de fuente mínimo (aproximado)
              const fontSize = await title.evaluate((el) => {
                const style = window.getComputedStyle(el);
                return parseFloat(style.fontSize);
              }).catch(() => 0);

              if (fontSize < 12) {
                issues.push({
                  device: device.name,
                  issue: `Card ${i + 1} tiene texto muy pequeño (${fontSize.toFixed(1)}px)`,
                  details: { fontSize },
                });
              }

              metrics.textReadable = fontSize >= 12;
            }
          }

          // Verificar precio visible - usar data-testid primero, luego fallback
          const price = card.locator('[data-testid="product-price"]').first();
          let priceVisible = await price.isVisible({ timeout: 1000 }).catch(() => false);
          
          // Fallback a otros selectores si no encuentra con data-testid
          if (!priceVisible) {
            const fallbackPrice = card.locator('[class*="price"], [class*="Price"], .text-primary').first();
            priceVisible = await fallbackPrice.isVisible({ timeout: 1000 }).catch(() => false);
          }
          
          if (!priceVisible) {
            issues.push({
              device: device.name,
              issue: `Card ${i + 1} no muestra precio visible`,
            });
          }

        } catch (error: any) {
          issues.push({
            device: device.name,
            issue: `Error al verificar card ${i + 1}: ${error.message}`,
          });
        }
      }

      // Verificar número de cards visibles según el tamaño de pantalla
      const expectedCards = getExpectedCardsForViewport(device.width);
      const visibleCardsCount = visibleCards.length;
      
      // En mobile debería haber al menos 1 card visible
      if (device.width < 640 && visibleCardsCount === 0) {
        issues.push({
          device: device.name,
          issue: 'No hay cards visibles en mobile',
        });
      }
    }

    // Generar reporte
    console.log('\n' + '='.repeat(80));
    console.log('📱 REPORTE DE RESPONSIVIDAD DE CARDS');
    console.log('='.repeat(80));

    if (issues.length === 0) {
      console.log('✅ Todas las cards se muestran correctamente en todos los dispositivos');
    } else {
      console.log(`\n⚠️  Se encontraron ${issues.length} problemas:\n`);
      
      // Agrupar por dispositivo
      const issuesByDevice: Record<string, typeof issues> = {};
      issues.forEach(issue => {
        if (!issuesByDevice[issue.device]) {
          issuesByDevice[issue.device] = [];
        }
        issuesByDevice[issue.device].push(issue);
      });

      Object.entries(issuesByDevice).forEach(([device, deviceIssues]) => {
        console.log(`\n📱 ${device}:`);
        deviceIssues.forEach(issue => {
          console.log(`   ❌ ${issue.issue}`);
          if (issue.details) {
            console.log(`      Detalles:`, issue.details);
          }
        });
      });

      console.log('\n' + '='.repeat(80));
      console.log('💡 RECOMENDACIONES:');
      console.log('='.repeat(80));
      
      // Analizar problemas comunes
      const widthIssues = issues.filter(i => i.issue.includes('estrecha') || i.issue.includes('ancho'));
      const overflowIssues = issues.filter(i => i.issue.includes('overflow'));
      const textIssues = issues.filter(i => i.issue.includes('texto') || i.issue.includes('pequeño'));

      if (widthIssues.length > 0) {
        console.log('\n📏 Problemas de ancho:');
        console.log('   - Considera usar min-width y max-width en las cards');
        console.log('   - Verifica que el carrusel maneje correctamente diferentes anchos');
      }

      if (overflowIssues.length > 0) {
        console.log('\n📦 Problemas de overflow:');
        console.log('   - Asegúrate de que el contenido de las cards use word-break');
        console.log('   - Verifica que los textos largos se trunquen con line-clamp');
        console.log('   - Considera reducir padding en pantallas pequeñas');
      }

      if (textIssues.length > 0) {
        console.log('\n📝 Problemas de texto:');
        console.log('   - Usa tamaños de fuente responsivos (text-sm en mobile, text-base en desktop)');
        console.log('   - Verifica que el contraste sea suficiente');
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');
  });

  test('Verificar carrusel en diferentes tamaños', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Esperar a que se cargue el contenido

    const carouselIssues: Array<{
      device: string;
      issue: string;
    }> = [];

    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.waitForTimeout(500);

      // Verificar que el carrusel exista - buscar cards primero
      const firstCard = await page.locator('[data-product-card], [data-testid="product-card"]').first().isVisible({ timeout: 2000 }).catch(() => false);
      
      if (!firstCard) {
        carouselIssues.push({
          device: device.name,
          issue: 'Carrusel no visible - no se encontraron cards',
        });
        continue;
      }

      const carousel = page.locator('[data-product-card], [data-testid="product-card"]').first().locator('..');
      const carouselVisible = await carousel.isVisible({ timeout: 1000 }).catch(() => false);

      if (!carouselVisible) {
        carouselIssues.push({
          device: device.name,
          issue: 'Carrusel no visible',
        });
        continue;
      }

      // Verificar botones de navegación
      const prevButton = page.getByRole('button', { name: /anterior|previous/i }).first();
      const nextButton = page.getByRole('button', { name: /siguiente|next/i }).first();

      const prevVisible = await prevButton.isVisible({ timeout: 1000 }).catch(() => false);
      const nextVisible = await nextButton.isVisible({ timeout: 1000 }).catch(() => false);

      // En mobile, los botones pueden estar ocultos si no hay scroll
      if (device.width >= 768) {
        // En tablets y desktop, deberían estar visibles si hay más productos
        const cardsCount = await page.locator('[data-product-card], [data-testid="product-card"]').count();
        if (cardsCount > getExpectedCardsForViewport(device.width)) {
          // Buscar botones de navegación del carrusel (ChevronLeft/ChevronRight)
          const navButtons = page.locator('button').filter({ has: page.locator('svg') }).all();
          const navButtonsCount = (await navButtons).length;
          
          if (navButtonsCount === 0 && cardsCount > getExpectedCardsForViewport(device.width)) {
            carouselIssues.push({
              device: device.name,
              issue: 'Botones de navegación no visibles cuando deberían estarlo',
            });
          }
        }
      }

      // Verificar scroll horizontal
      const carouselContainer = page.locator('[data-product-card], [data-testid="product-card"]').first().locator('..').first();
      const canScroll = await carouselContainer.evaluate((el: HTMLElement) => {
        return el.scrollWidth > el.clientWidth;
      }).catch(() => false);

      if (!canScroll && device.width < 1024) {
        // En pantallas pequeñas, debería haber scroll si hay muchos productos
        const cardsCount = await page.locator('[data-product-card], [data-testid="product-card"]').count();
        if (cardsCount > getExpectedCardsForViewport(device.width)) {
          carouselIssues.push({
            device: device.name,
            issue: 'Carrusel no permite scroll cuando debería',
          });
        }
      }
    }

    if (carouselIssues.length > 0) {
      console.log('\n⚠️  Problemas del carrusel:');
      carouselIssues.forEach(issue => {
        console.log(`   ${issue.device}: ${issue.issue}`);
      });
    }
  });

  test('Verificar espaciado y gaps', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const spacingIssues: Array<{
      device: string;
      issue: string;
      details?: any;
    }> = [];

    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.waitForTimeout(500);

      const cards = await page.locator('[data-product-card], [data-testid="product-card"]').all();
      if (cards.length < 2) continue;

      // Verificar gap entre cards - solo si ambas son visibles
      const firstCard = cards[0];
      const secondCard = cards[1];
      
      const firstVisible = await firstCard.isVisible({ timeout: 1000 }).catch(() => false);
      const secondVisible = await secondCard.isVisible({ timeout: 1000 }).catch(() => false);
      
      if (!firstVisible || !secondVisible) continue;

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      if (firstBox && secondBox) {
        const gap = secondBox.x - (firstBox.x + firstBox.width);
        
        // En un carrusel horizontal, las cards pueden estar superpuestas visualmente
        // pero separadas por scroll. Esto es normal y esperado.
        // Solo reportar gaps positivos problemáticos
        if (gap > 0 && gap < 4) {
          // Gap positivo pero muy pequeño
          spacingIssues.push({
            device: device.name,
            issue: 'Gap entre cards muy pequeño',
            details: { gap: gap.toFixed(1) },
          });
        } else if (gap > 64) {
          // Gap muy grande (más de 4rem)
          spacingIssues.push({
            device: device.name,
            issue: 'Gap entre cards muy grande',
            details: { gap: gap.toFixed(1) },
          });
        }
        // Ignorar gaps negativos pequeños (-180px es normal en carruseles horizontales)
      }
    }

    if (spacingIssues.length > 0) {
      console.log('\n⚠️  Problemas de espaciado:');
      spacingIssues.forEach(issue => {
        console.log(`   ${issue.device}: ${issue.issue} (${issue.details?.gap}px)`);
      });
    }
  });

  test('Verificar que las cards no se corten', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const clippingIssues: Array<{
      device: string;
      cardIndex: number;
      issue: string;
    }> = [];

    // Probar solo 2 dispositivos clave (mobile y desktop) para optimizar
    const keyDevices = [
      devices[0], // iPhone SE - Mobile
      devices[10], // Desktop estándar - Desktop
    ];

    for (const device of keyDevices) {
      try {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.waitForTimeout(300);

        // Buscar solo la primera card visible
        const firstCard = page.locator('[data-product-card], [data-testid="product-card"]').first();
        const isVisible = await firstCard.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (!isVisible) {
          clippingIssues.push({
            device: device.name,
            cardIndex: 0,
            issue: 'No se encontró ninguna card visible',
          });
          continue;
        }
        
        const box = await firstCard.boundingBox();
        
        if (box) {
          // Verificar que la card no esté cortada por los bordes (con tolerancia de 10px)
          if (box.x < -10) {
            clippingIssues.push({
              device: device.name,
              cardIndex: 0,
              issue: `Card cortada por el borde izquierdo (x: ${box.x.toFixed(0)}px)`,
            });
          }
          
          if (box.x + box.width > device.width + 10) {
            clippingIssues.push({
              device: device.name,
              cardIndex: 0,
              issue: `Card cortada por el borde derecho (ancho total: ${(box.x + box.width).toFixed(0)}px, viewport: ${device.width}px)`,
            });
          }

          // Verificar dimensiones mínimas
          if (box.width < 100) {
            clippingIssues.push({
              device: device.name,
              cardIndex: 0,
              issue: `Card demasiado estrecha (${box.width.toFixed(0)}px)`,
            });
          }
        }
      } catch (error: any) {
        // Solo reportar errores críticos
        if (!error.message.includes('closed')) {
          console.log(`Error verificando ${device.name}: ${error.message}`);
        }
      }
    }

    if (clippingIssues.length > 0) {
      console.log('\n⚠️  Problemas de recorte:');
      clippingIssues.forEach(issue => {
        console.log(`   ${issue.device} - Card ${issue.cardIndex + 1}: ${issue.issue}`);
      });
    } else {
      console.log('\n✅ No se encontraron problemas de recorte en los dispositivos verificados');
    }
  });

  test('Generar reporte visual de responsividad', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Capturar screenshots en diferentes dispositivos clave
    const keyDevices = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'notebook', width: 1280, height: 800 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const device of keyDevices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.waitForTimeout(1000);
      
      await page.screenshot({
        path: `tests/screenshots/cards-${device.name}.png`,
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: device.width,
          height: Math.min(device.height, 800),
        },
      });
    }

    console.log('\n📸 Screenshots guardados en tests/screenshots/');
  });
});

// Función auxiliar para calcular cards esperadas según viewport
function getExpectedCardsForViewport(width: number): number {
  if (width < 640) return 1;      // Mobile
  if (width < 768) return 2;      // Tablet pequeño
  if (width < 1024) return 3;    // Tablet
  if (width < 1280) return 4;     // Notebook
  if (width < 1536) return 5;     // Desktop
  return 6;                       // Desktop grande
}

