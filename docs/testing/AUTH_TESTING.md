# Tests Automatizados de Autenticación

Este documento describe los tests automatizados para el flujo de registro e inicio de sesión de usuarios.

## Estructura de Tests

Los tests están organizados en tres grupos principales:

### 1. Authentication - Login
Tests que verifican el formulario de inicio de sesión:
- ✅ Visualización del formulario con todos los campos requeridos
- ✅ Validación de campos vacíos
- ✅ Toggle de visibilidad de contraseña
- ✅ Manejo de credenciales inválidas
- ✅ Navegación a página de registro
- ✅ Navegación a página de recuperación de contraseña

### 2. Authentication - Register
Tests que verifican el formulario de registro:
- ✅ Visualización del formulario con todos los campos requeridos
- ✅ Validación de campos vacíos
- ✅ Validación de longitud mínima de contraseña (6 caracteres)
- ✅ Toggle de visibilidad de contraseña
- ✅ Validación de formato de email
- ✅ Navegación a página de login
- ✅ Intento de registro con datos válidos

### 3. Authentication - Complete Flow
Tests que verifican el flujo completo:
- ✅ Flujo completo de registro seguido de login
- ✅ Manejo correcto del estado del formulario al navegar entre páginas

## Ejecutar los Tests

### Ejecutar todos los tests de autenticación:
```bash
npm run test:auth
```

### Ejecutar con interfaz visual:
```bash
npx playwright test tests/e2e/auth.spec.ts --ui
```

### Ejecutar en modo debug:
```bash
npx playwright test tests/e2e/auth.spec.ts --debug
```

### Ejecutar un test específico:
```bash
npx playwright test tests/e2e/auth.spec.ts -g "should display login form"
```

## Consideraciones Importantes

### Configuración de Supabase

Los tests están diseñados para funcionar tanto con Supabase configurado como sin configurar:

- **Con Supabase configurado**: Los tests intentarán realizar registro e inicio de sesión reales
- **Sin Supabase configurado**: Los tests verifican la UI y validaciones del lado del cliente

### Usuarios de Prueba

Los tests generan emails únicos automáticamente usando:
```typescript
const generateUniqueEmail = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@test.com`;
};
```

Esto evita conflictos entre ejecuciones de tests.

### Confirmación de Usuarios

**Nota importante**: En entornos de desarrollo, los usuarios registrados pueden requerir confirmación manual en Supabase Dashboard:
1. Ve a Supabase Dashboard > Authentication > Users
2. Busca el usuario de prueba
3. Haz clic en "Confirm" para activar el usuario

Si un usuario no está confirmado, el test de login puede fallar, pero esto es esperado y no indica un problema con el código.

### Timeouts

Los tests incluyen timeouts apropiados para:
- Esperar respuestas de Supabase (2-3 segundos)
- Permitir que los toasts aparezcan
- Dar tiempo a las redirecciones

## Cobertura de Tests

### Login
- ✅ Campos requeridos visibles
- ✅ Validación HTML5 de campos vacíos
- ✅ Toggle de contraseña funciona
- ✅ Manejo de errores de credenciales
- ✅ Navegación entre páginas

### Registro
- ✅ Campos requeridos visibles
- ✅ Validación HTML5 de campos vacíos
- ✅ Validación de longitud mínima de contraseña
- ✅ Validación de formato de email
- ✅ Toggle de contraseña funciona
- ✅ Intento de registro con datos válidos
- ✅ Navegación entre páginas

### Flujo Completo
- ✅ Registro seguido de login
- ✅ Estado del formulario al navegar

## Mejoras Futuras

Posibles mejoras para los tests:
1. Mock de Supabase para tests más rápidos y determinísticos
2. Tests de integración con Supabase real en CI/CD
3. Tests de recuperación de contraseña
4. Tests de sesión persistente
5. Tests de logout
6. Tests de acceso a rutas protegidas

## Troubleshooting

### Los tests fallan con "Element not found"
- Verifica que el servidor de desarrollo esté corriendo (`npm run dev`)
- Verifica que las rutas `/auth/login` y `/auth/register` existan
- Verifica que los labels de los campos coincidan con los del código

### Los tests de login fallan
- Verifica que Supabase esté configurado correctamente
- Verifica que el usuario de prueba esté confirmado en Supabase Dashboard
- Revisa los logs del navegador en modo debug

### Los tests son lentos
- Los timeouts están configurados para ser conservadores
- Puedes reducir los `waitForTimeout` si tu entorno es más rápido
- Considera usar `waitForSelector` en lugar de `waitForTimeout` cuando sea posible

