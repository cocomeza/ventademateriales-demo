# Mejoras de Responsividad Móvil

## Cambios Implementados

### 1. Navbar Móvil
- ✅ Menú hamburguesa con Sheet component
- ✅ Navegación oculta en móviles, visible en desktop (`hidden md:flex`)
- ✅ Carrito visible en móvil junto al menú
- ✅ Menú lateral deslizable desde la derecha

### 2. Productos
- ✅ Cards más compactas en móvil (`h-40` vs `h-48`)
- ✅ Padding reducido en móvil (`p-3` vs `p-4`)
- ✅ Grid: 1 columna móvil, 2 tablet, 3-4 desktop
- ✅ Gaps reducidos en móvil (`gap-4` vs `gap-6`)

### 3. Catálogo
- ✅ Filtros en grid responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- ✅ Padding adaptativo en cards
- ✅ Texto más pequeño en móvil

### 4. Banner Promocional
- ✅ Títulos escalables (`text-xl sm:text-2xl md:text-3xl`)
- ✅ Descripción truncada en móvil (`line-clamp-2`)
- ✅ Padding reducido (`p-4 sm:p-6`)

### 5. Container y Spacing
- ✅ Padding del container: `1rem` móvil, `1.5rem` tablet, `2rem` desktop
- ✅ Espaciado vertical reducido en móvil
- ✅ Títulos escalables según breakpoint

### 6. Tests Automatizados
- ✅ Tests de responsividad creados (`tests/responsive/responsive.spec.ts`)
- ✅ Verificación de múltiples viewports
- ✅ Verificación de overflow horizontal
- ✅ Verificación de botones touch-friendly

## Instalación Necesaria

Si falta el componente Sheet, ejecuta:

```bash
npm install @radix-ui/react-dialog
```

Ya está en `package.json`, solo verifica que esté instalado.

## Breakpoints Usados

- **Móvil**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

## Archivos Modificados

- `components/navbar.tsx` - Menú móvil
- `components/product-card.tsx` - Cards responsive
- `components/product-catalog.tsx` - Grid y filtros responsive
- `components/promotional-banner.tsx` - Banner responsive
- `components/category-showcase.tsx` - Categorías responsive
- `components/featured-products.tsx` - Títulos responsive
- `components/footer.tsx` - Footer responsive
- `app/page.tsx` - Padding y spacing responsive
- `app/contacto/page.tsx` - Layout responsive
- `tailwind.config.ts` - Container padding responsive
- `components/ui/sheet.tsx` - Componente Sheet creado

## Ejecutar Tests

```bash
npm run test:playwright -- tests/responsive/responsive.spec.ts
```

