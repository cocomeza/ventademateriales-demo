# 🧪 Testing

Guía consolidada de testing del proyecto.

## 📋 Resumen

- **Tests Unitarios**: Vitest
- **Tests E2E**: Playwright
- **Cobertura**: Tests de lógica de negocio, UI y flujos completos

## 📚 Documentación

### Resumen General
Ver: [TESTING_SUMMARY.md](testing/TESTING_SUMMARY.md)

### Tests Implementados
Ver: [TESTS_IMPLEMENTED.md](testing/TESTS_IMPLEMENTED.md)

### Mejoras de Testing
Ver: [TEST_IMPROVEMENTS.md](testing/TEST_IMPROVEMENTS.md)

### Tests Faltantes
Ver: [MISSING_TESTS.md](testing/MISSING_TESTS.md)

### Testing de Autenticación
Ver: [AUTH_TESTING.md](testing/AUTH_TESTING.md)

## 🚀 Comandos

```bash
# Tests unitarios
npm run test:unit

# Tests E2E
npm run test:e2e

# Todos los tests
npm run test:all

# Tests específicos
npm run test:auth
npm run test:admin
npm run test:checkout
```

## 📊 Cobertura

- ✅ Lógica de negocio (stock, precios)
- ✅ Componentes UI
- ✅ Flujos completos (compra, autenticación)
- ✅ Accesibilidad
- ✅ SEO
- ✅ Performance

