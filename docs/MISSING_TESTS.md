# Tests Faltantes - MaterialesYA

Este documento lista los tests automatizados que faltan implementar para cubrir todas las funcionalidades del proyecto.

**⚠️ NOTA:** Muchos tests han sido implementados. Ver `docs/TESTS_IMPLEMENTED.md` para la lista completa de tests implementados.

## 📊 Resumen

**Tests Existentes:**
- ✅ Autenticación (login/registro) - `tests/e2e/auth.spec.ts` - **COMPLETO**
- ✅ Comparador de Productos - `tests/e2e/product-comparator.spec.ts` - **COMPLETO**
- ✅ Favoritos/Wishlist - `tests/e2e/wishlist.spec.ts` - **COMPLETO**
- ✅ Checkout vía WhatsApp - `tests/e2e/checkout.spec.ts` - **COMPLETO**
- ✅ Carrito mejorado - `tests/e2e/cart-improved.spec.ts` - **COMPLETO**
- ✅ Perfil de Usuario - `tests/e2e/user-profile.spec.ts` - **COMPLETO**
- ✅ Búsqueda Global - `tests/e2e/global-search.spec.ts` - **COMPLETO**
- ✅ Páginas de Categorías - `tests/e2e/categories.spec.ts` - **COMPLETO**
- ✅ Modo Oscuro - `tests/e2e/dark-mode.spec.ts` - **COMPLETO**
- ✅ Productos mejorados - `tests/e2e/products-improved.spec.ts` - **COMPLETO**
- ✅ Pedidos - `tests/e2e/orders.spec.ts` - **COMPLETO**
- ✅ Navegación básica - `tests/e2e/navigation.spec.ts`
- ✅ Responsive - `tests/responsive/`
- ✅ Accesibilidad - `tests/accessibility/a11y.spec.ts`
- ✅ SEO - `tests/seo/seo.spec.ts`
- ✅ Seguridad - `tests/security/security.spec.ts`
- ✅ Performance - `tests/performance/performance.spec.ts`
- ✅ Visual - `tests/visual/visual.spec.ts`

## ❌ Tests Faltantes por Funcionalidad

### 🛍️ Catálogo de Productos

#### Tests Básicos Existentes pero Mejorables:
- [ ] **Filtros avanzados** - Probar todos los filtros (categoría, precio, stock, ordenamiento)
- [ ] **Paginación** - Verificar navegación entre páginas, cambio de items por página
- [ ] **Vista Grid/List** - Toggle entre vistas, persistencia de preferencia
- [ ] **Búsqueda en catálogo** - Búsqueda local, filtrado en tiempo real
- [ ] **URL persistence** - Los filtros se mantienen en la URL al recargar

#### Tests Nuevos Necesarios:
- [ ] **Productos destacados** - Verificar que se muestran correctamente
- [ ] **Productos sin stock** - Verificar que se muestran con indicador de agotado
- [ ] **Variantes de productos** - Selección de variantes, cambio de precio/stock
- [ ] **Precios mayoristas** - Verificar que se muestran según el rol del usuario

### 🔍 Búsqueda Global

- [ ] **Búsqueda desde header** - Autocompletado, sugerencias
- [ ] **Página de resultados** - `/buscar?q=term` muestra resultados correctos
- [ ] **Búsqueda vacía** - Manejo de búsquedas sin resultados
- [ ] **Búsqueda con caracteres especiales** - Manejo de acentos, símbolos
- [ ] **Debounce** - Verificar que no hace demasiadas peticiones

### 🔄 Comparador de Productos

- [ ] **Agregar productos al comparador** - Botón en cards, límite de productos
- [ ] **Ver comparador** - Abrir modal/drawer, mostrar productos
- [ ] **Comparar características** - Tabla de comparación, diferencias destacadas
- [ ] **Eliminar del comparador** - Remover productos individuales
- [ ] **Limpiar comparador** - Botón para limpiar todo
- [ ] **Persistencia** - El comparador se mantiene al recargar

### ❤️ Favoritos/Wishlist

- [ ] **Agregar a favoritos** - Botón en cards, estado visual
- [ ] **Eliminar de favoritos** - Remover productos
- [ ] **Página de favoritos** - `/wishlist` muestra productos guardados
- [ ] **Agregar al carrito desde favoritos** - Botón en wishlist
- [ ] **Favoritos vacíos** - Mensaje cuando no hay favoritos
- [ ] **Autenticación requerida** - Redirige a login si no está autenticado

### 🛒 Carrito de Compras (Mejorar tests existentes)

- [ ] **Agregar productos** - Diferentes productos, cantidades
- [ ] **Modificar cantidades** - Incrementar/decrementar
- [ ] **Eliminar productos** - Remover items individuales
- [ ] **Vaciar carrito** - Botón para limpiar todo
- [ ] **Cálculo de totales** - Subtotal, descuentos, total final
- [ ] **Persistencia** - El carrito se mantiene al recargar
- [ ] **Validación de stock** - No permitir agregar más del disponible
- [ ] **Precios según usuario** - Precios mayoristas para usuarios con rol

### 📱 Checkout vía WhatsApp

- [ ] **Abrir diálogo de checkout** - Desde carrito, validación de campos
- [ ] **Formulario de checkout** - Campos requeridos, validación
- [ ] **Generación de mensaje** - Formato correcto del mensaje de WhatsApp
- [ ] **Redirección a WhatsApp** - Abre WhatsApp con mensaje prellenado
- [ ] **Guardar orden en BD** - Si está autenticado, guarda en Supabase
- [ ] **Limpiar carrito después** - El carrito se vacía después del checkout
- [ ] **Manejo de errores** - Si falla el guardado, mostrar error

### 📦 Seguimiento de Pedidos

- [ ] **Página de pedidos** - `/orders` muestra historial
- [ ] **Estados de pedidos** - Pendiente, en proceso, completado, cancelado
- [ ] **Detalles de pedido** - Ver items, totales, información del cliente
- [ ] **Filtros de pedidos** - Por estado, fecha
- [ ] **Autenticación requerida** - Solo usuarios autenticados pueden ver pedidos

### 👤 Perfil de Usuario

- [ ] **Página de perfil** - `/perfil` muestra información del usuario
- [ ] **Editar perfil** - Cambiar nombre, teléfono, dirección
- [ ] **Cambiar contraseña** - Formulario de cambio de contraseña
- [ ] **Validación de formularios** - Campos requeridos, formato de email/teléfono
- [ ] **Guardar cambios** - Actualización en Supabase
- [ ] **Autenticación requerida** - Redirige a login si no está autenticado

### 🏷️ Páginas de Categorías

- [ ] **Página de categoría** - `/categorias/[slug]` muestra productos filtrados
- [ ] **Breadcrumbs** - Navegación correcta
- [ ] **Imagen de categoría** - Si existe, se muestra correctamente
- [ ] **Descripción de categoría** - Se muestra si existe
- [ ] **Filtros en categoría** - Los filtros funcionan en páginas de categoría
- [ ] **Categoría no encontrada** - Manejo de 404

### 🌙 Modo Oscuro

- [ ] **Toggle de tema** - Botón en navbar funciona
- [ ] **Cambio de tema** - Light, dark, system
- [ ] **Persistencia** - El tema se mantiene al recargar
- [ ] **Aplicación visual** - Los estilos se aplican correctamente
- [ ] **Dropdown de opciones** - Menú con opciones Light/Dark/System

### 🔍 Búsqueda Global (Header)

- [ ] **Input de búsqueda** - Visible en desktop y mobile
- [ ] **Autocompletado** - Muestra sugerencias mientras escribe
- [ ] **Navegación a resultados** - Redirige a `/buscar?q=term`
- [ ] **Búsqueda vacía** - Manejo cuando no hay texto
- [ ] **Debounce** - No hace peticiones en cada tecla

### 📊 Panel de Administración

#### Autenticación y Autorización:
- [ ] **Acceso restringido** - Solo usuarios con rol admin pueden acceder
- [ ] **Redirección** - Usuarios sin permisos son redirigidos
- [ ] **Protección de rutas** - Todas las rutas `/admin/*` están protegidas

#### Gestión de Productos:
- [ ] **Lista de productos** - Tabla muestra todos los productos
- [ ] **Crear producto** - Formulario completo, validaciones
- [ ] **Editar producto** - Cargar datos, actualizar
- [ ] **Eliminar producto** - Confirmación, eliminación
- [ ] **Subir imágenes** - Múltiples imágenes por producto
- [ ] **Variantes** - Agregar/editar variantes de productos

#### Gestión de Categorías:
- [ ] **Lista de categorías** - Tabla con jerarquía
- [ ] **Crear categoría** - Formulario, slug automático
- [ ] **Editar categoría** - Incluyendo imagen
- [ ] **Eliminar categoría** - Con validación de productos asociados
- [ ] **Subir imagen** - Campo de imagen de categoría

#### Gestión de Inventario:
- [ ] **Alertas de stock bajo** - Lista de productos con stock bajo
- [ ] **Actualizar stock** - Cambiar cantidad disponible
- [ ] **Historial de cambios** - Ver cambios de stock

#### Gestión de Pedidos:
- [ ] **Lista de pedidos** - Todos los pedidos con filtros
- [ ] **Cambiar estado** - Actualizar estado del pedido
- [ ] **Ver detalles** - Items, cliente, totales
- [ ] **Descontar stock** - Al marcar como completado

#### Gestión de Clientes:
- [ ] **Lista de clientes** - Tabla con información
- [ ] **Ver perfil** - Detalles del cliente
- [ ] **Precios personalizados** - Asignar precios especiales
- [ ] **Historial de pedidos** - Pedidos del cliente

#### Descuentos:
- [ ] **Lista de descuentos** - Todos los descuentos activos
- [ ] **Crear descuento** - Porcentaje, fijo, volumen
- [ ] **Aplicar descuentos** - Verificar que se aplican correctamente

#### Importación/Exportación:
- [ ] **Exportar productos** - Descargar CSV
- [ ] **Importar productos** - Subir CSV, validación
- [ ] **Formato correcto** - Validar estructura del CSV

### 📄 Páginas Estáticas

- [ ] **Página de contacto** - `/contacto` muestra formulario
- [ ] **Términos y condiciones** - `/terminos-y-condiciones` carga contenido
- [ ] **Política de privacidad** - `/privacidad` carga contenido
- [ ] **404 Not Found** - Página personalizada para rutas no encontradas
- [ ] **Error page** - Manejo de errores generales

### 🔐 Autenticación (Mejorar tests existentes)

- [ ] **Logout** - Cerrar sesión correctamente
- [ ] **Sesión persistente** - La sesión se mantiene al recargar
- [ ] **Protección de rutas** - Rutas protegidas redirigen a login
- [ ] **Reset password** - Formulario de recuperación de contraseña
- [ ] **Callback de autenticación** - `/auth/callback` procesa correctamente

### 🎨 Componentes UI Específicos

- [ ] **ProductCard** - Todas las interacciones (agregar carrito, favoritos, comparar)
- [ ] **ProductCarousel** - Navegación, responsive, múltiples productos
- [ ] **Pagination** - Navegación entre páginas, cambio de tamaño
- [ ] **ViewToggle** - Cambio entre grid/list, persistencia
- [ ] **ThemeToggle** - Cambio de tema, persistencia
- [ ] **GlobalSearch** - Autocompletado, navegación

## 📝 Prioridades Sugeridas

### Alta Prioridad:
1. **Comparador de Productos** - Funcionalidad nueva importante
2. **Favoritos/Wishlist** - Funcionalidad core del e-commerce
3. **Checkout vía WhatsApp** - Flujo crítico de ventas
4. **Mejorar tests de Carrito** - Tests actuales son muy básicos
5. **Perfil de Usuario** - Funcionalidad importante para usuarios

### Media Prioridad:
6. **Búsqueda Global** - Funcionalidad nueva implementada
7. **Páginas de Categorías** - Rutas dinámicas importantes
8. **Modo Oscuro** - Funcionalidad nueva implementada
9. **Mejorar tests de Productos** - Tests actuales son muy básicos
10. **Seguimiento de Pedidos** - Importante para usuarios

### Baja Prioridad:
11. **Panel de Administración** - Puede probarse manualmente inicialmente
12. **Páginas Estáticas** - Menos crítico
13. **Componentes UI específicos** - Pueden probarse con tests de integración

## 🚀 Cómo Empezar

Para implementar estos tests, puedes seguir el patrón de los tests existentes:

1. **Revisar tests existentes** como referencia (`tests/e2e/auth.spec.ts`)
2. **Crear archivo nuevo** en la carpeta apropiada (`tests/e2e/`, `tests/integration/`, etc.)
3. **Seguir estructura** de `test.describe()` y `test()` blocks
4. **Usar selectores específicos** como `page.locator('main form')` para evitar conflictos
5. **Manejar casos sin Supabase** - Los tests deben funcionar aunque Supabase no esté configurado

## 📚 Ejemplos de Tests a Crear

### Ejemplo: Test de Comparador
```typescript
test.describe('Product Comparator', () => {
  test('should add products to comparator', async ({ page }) => {
    await page.goto('/');
    // Buscar botón de comparar en una card
    const compareButton = page.locator('button[aria-label*="comparar"]').first();
    await compareButton.click();
    // Verificar que se agregó al comparador
  });
});
```

### Ejemplo: Test de Wishlist
```typescript
test.describe('Wishlist', () => {
  test('should add product to wishlist when authenticated', async ({ page }) => {
    // Login primero
    await page.goto('/auth/login');
    // ... login steps
    // Luego agregar a favoritos
    await page.goto('/');
    const favoriteButton = page.locator('button[aria-label*="favorito"]').first();
    await favoriteButton.click();
  });
});
```

