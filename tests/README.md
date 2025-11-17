# Tests Automatizados

Este directorio contiene todos los tests automatizados del proyecto MaterialesYA.

## 📁 Estructura

```
tests/
├── unit/              # Tests unitarios (Vitest)
├── e2e/               # Tests end-to-end (Playwright)
├── integration/       # Tests de integración
├── accessibility/     # Tests de accesibilidad (a11y)
├── seo/               # Tests de SEO
├── performance/       # Tests de performance
├── visual/            # Tests visuales (screenshots)
├── security/          # Tests de seguridad
└── utils/             # Utilidades para tests
```

## 🚀 Ejecutar Tests

### Tests Unitarios (Vitest)
```bash
npm run test:unit          # Ejecutar una vez
npm run test:watch        # Modo watch
npm test                  # Alias para vitest
```

### Tests E2E (Playwright)
```bash
npm run test:e2e          # Tests end-to-end
npm run test:e2e:ui       # Con interfaz gráfica
```

### Tests Específicos
```bash
npm run test:accessibility   # Tests de accesibilidad
npm run test:seo            # Tests de SEO
npm run test:performance    # Tests de performance
npm run test:visual         # Tests visuales
npm run test:security       # Tests de seguridad
npm run test:integration    # Tests de integración
```

### Todos los Tests
```bash
npm run test:all           # Ejecutar todos los tests
npm run test:playwright    # Todos los tests de Playwright
```

## 📊 Cobertura de Tests

Para ver la cobertura de código:
```bash
npm run test:unit -- --coverage
```

## 🔧 Configuración

### Variables de Entorno para Tests

Crea un archivo `.env.test` con las variables necesarias:
```env
NEXT_PUBLIC_SUPABASE_URL=your-test-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-key
```

### Playwright

Los tests de Playwright se ejecutan contra `http://localhost:3000` por defecto.
El servidor se inicia automáticamente antes de ejecutar los tests.

## 📝 Escribir Nuevos Tests

### Test Unitario (Vitest)
```typescript
import { describe, it, expect } from 'vitest';

describe('MiComponente', () => {
  it('debería hacer algo', () => {
    expect(true).toBe(true);
  });
});
```

### Test E2E (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('debería navegar a la página', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/MaterialesYA/);
});
```

## 🐛 Debugging

### Playwright UI Mode
```bash
npm run test:e2e:ui
```

### Playwright Inspector
```bash
PWDEBUG=1 npm run test:e2e
```

### Vitest UI
```bash
npm run test:watch
```

## 📈 CI/CD

Los tests se ejecutan automáticamente en CI/CD. Ver `.github/workflows/ci.yml` para más detalles.

