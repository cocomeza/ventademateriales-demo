# Auditoría de Botones de Navegación

Este test automatizado verifica que todos los botones de navegación estén presentes y funcionando correctamente en la aplicación.

## ¿Qué hace este test?

1. **Navega por todas las páginas principales** de la aplicación
2. **Identifica todos los botones** en cada página
3. **Verifica que los botones sean clickeables** y funcionen correctamente
4. **Detecta botones faltantes** en rutas críticas
5. **Identifica botones rotos** que no responden a clicks
6. **Genera un reporte detallado** con todos los hallazgos

## Cómo ejecutar

```bash
# Ejecutar solo el test de botones
npm run test:buttons

# O con Playwright directamente
npx playwright test tests/e2e/button-navigation.spec.ts
```

## Páginas auditadas

- `/` - Homepage
- `/contacto` - Página de contacto
- `/auth/login` - Página de login
- `/auth/register` - Página de registro
- `/cart` - Carrito de compras
- `/wishlist` - Lista de favoritos
- `/orders` - Historial de pedidos

## Botones críticos verificados

- **Navbar**: Productos, Contacto, Iniciar Sesión, Carrito
- **Cards de productos**: Agregar al carrito, Favoritos
- **Filtros**: Botón de filtros, Limpiar filtros
- **Paginación**: Botones de navegación entre páginas

## Interpretación del reporte

### ✅ Botones encontrados
Botones que están presentes y funcionando correctamente.

### ❌ Botones rotos
Botones que están presentes pero no funcionan correctamente:
- No responden a clicks
- Están deshabilitados cuando no deberían
- Causan errores al hacer click

### ⚠️ Botones faltantes
Botones que se esperan en una página pero no se encontraron:
- Botones críticos de navegación
- Botones esperados según el diseño

## Solución de problemas

Si encuentras botones rotos o faltantes:

1. **Revisa la consola del navegador** para ver errores JavaScript
2. **Verifica que los componentes estén correctamente importados**
3. **Asegúrate de que las rutas estén correctamente configuradas**
4. **Revisa que los botones tengan los handlers de eventos correctos**

## Ejemplo de salida

```
📄 Homepage (/):
   ✅ Botones encontrados: 15
   ❌ Botones rotos: 0
   ⚠️  Botones faltantes: 1
      - Ver más detalles

📄 Contacto (/contacto):
   ✅ Botones encontrados: 4
   ❌ Botones rotos: 0
   ⚠️  Botones faltantes: 0
```

