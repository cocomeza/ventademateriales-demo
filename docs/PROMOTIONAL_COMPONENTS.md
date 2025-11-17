# Componentes Promocionales y Publicitarios

## Resumen
Este documento describe los componentes promocionales y publicitarios agregados a la plataforma MaterialesYA para mejorar la experiencia del usuario y destacar productos y categorías.

## Componentes Creados

### 1. PromotionalBanner (`components/promotional-banner.tsx`)

Banner promocional principal con imagen de fondo, texto superpuesto y botón de acción.

#### Características:
- ✅ Imagen de fondo con efecto hover (zoom)
- ✅ Overlay oscuro para mejor legibilidad del texto
- ✅ Badge opcional para destacar promociones
- ✅ Botón de acción con link
- ✅ Variantes de tamaño (default, large, small)
- ✅ Accesible con aria-labels apropiados
- ✅ Lazy loading para imágenes

#### Uso:
```tsx
<PromotionalBanner
  title="Materiales de Construcción de Calidad"
  description="Encuentra todo lo que necesitas para tu proyecto"
  imageUrl="/images/banner.jpg"
  imageAlt="Banner promocional"
  linkUrl="/products"
  linkText="Explorar Catálogo"
  badge="Nuevo"
  variant="large"
/>
```

#### Props:
- `title` (string, requerido): Título del banner
- `description` (string, opcional): Descripción del banner
- `imageUrl` (string, opcional): URL de la imagen de fondo
- `imageAlt` (string, opcional): Texto alternativo para la imagen
- `linkUrl` (string, opcional): URL de destino del banner
- `linkText` (string, opcional): Texto del botón (default: "Ver más")
- `badge` (string, opcional): Badge promocional (ej: "Nuevo", "Oferta")
- `variant` ("default" | "large" | "small"): Tamaño del banner
- `className` (string, opcional): Clases CSS adicionales

### 2. CategoryShowcase (`components/category-showcase.tsx`)

Muestra categorías destacadas en formato de cards con imágenes y efectos hover.

#### Características:
- ✅ Grid responsive (2, 3 o 4 columnas)
- ✅ Imágenes de categorías con efecto hover
- ✅ Iconos de carrito y favoritos en hover
- ✅ Contador de productos por categoría
- ✅ Link a página de categoría
- ✅ Accesible con aria-labels

#### Uso:
```tsx
<CategoryShowcase
  categories={[
    {
      id: "1",
      name: "Cemento",
      slug: "cemento",
      description: "Cementos de calidad",
      imageUrl: "/images/cemento.jpg",
      productCount: 25
    }
  ]}
  title="Categorías Destacadas"
  columns={3}
/>
```

#### Props:
- `categories` (Category[], requerido): Array de categorías a mostrar
- `title` (string, opcional): Título de la sección
- `columns` (2 | 3 | 4): Número de columnas (default: 3)
- `className` (string, opcional): Clases CSS adicionales

### 3. FeaturedProducts (`components/featured-products.tsx`)

Muestra productos destacados en formato de grid.

#### Características:
- ✅ Grid responsive de productos
- ✅ Botón "Ver todos" opcional
- ✅ Límite configurable de productos
- ✅ Reutiliza ProductCard existente
- ✅ Accesible

#### Uso:
```tsx
<FeaturedProducts
  products={products}
  title="Productos Destacados"
  showViewAll={true}
  viewAllUrl="/"
  maxItems={8}
/>
```

#### Props:
- `products` (Product[], requerido): Array de productos
- `title` (string, opcional): Título de la sección
- `showViewAll` (boolean, opcional): Mostrar botón "Ver todos"
- `viewAllUrl` (string, opcional): URL del botón "Ver todos"
- `maxItems` (number, opcional): Máximo de productos a mostrar
- `className` (string, opcional): Clases CSS adicionales

## Implementación en Homepage

La homepage (`app/page.tsx`) ahora incluye:

1. **Banner Promocional Principal**: Banner grande con mensaje principal
2. **Categorías Destacadas**: Grid de 3 columnas con categorías activas
3. **Productos Destacados**: Grid de productos más recientes
4. **Catálogo Completo**: Lista completa de productos con filtros

## Mejoras de Paginación

La paginación en `ProductCatalog` ha sido mejorada para mostrar números de página en lugar de solo "Anterior/Siguiente":

- ✅ Números de página clickeables
- ✅ Indicador visual de página actual
- ✅ Navegación con flechas
- ✅ Máximo 5 números visibles
- ✅ Accesible con aria-labels y aria-current

## Personalización

### Agregar Imágenes de Banner

1. Coloca las imágenes en `public/images/banners/`
2. Usa el componente `PromotionalBanner` con la URL de la imagen:
```tsx
<PromotionalBanner
  imageUrl="/images/banners/promocion-verano.jpg"
  ...
/>
```

### Configurar Categorías Destacadas

Las categorías se cargan automáticamente desde Supabase. Para destacar categorías específicas:

1. Agrega un campo `featured` a la tabla `categories` en Supabase
2. Modifica la query en `app/page.tsx`:
```tsx
const { data: categories } = await supabase
  .from("categories")
  .select("id, name, slug, description")
  .eq("active", true)
  .eq("featured", true) // Agregar esta línea
  .order("name")
  .limit(6);
```

### Configurar Productos Destacados

Para destacar productos específicos:

1. Agrega un campo `featured` a la tabla `products` en Supabase
2. Modifica la query en `app/page.tsx`:
```tsx
const { data: featuredProducts } = await supabase
  .from("products")
  .select(...)
  .eq("active", true)
  .eq("featured", true) // Agregar esta línea
  .order("created_at", { ascending: false })
  .limit(8);
```

## Accesibilidad

Todos los componentes incluyen:
- ✅ aria-labels apropiados
- ✅ Navegación por teclado
- ✅ Texto alternativo para imágenes
- ✅ Roles ARIA donde corresponde
- ✅ Contraste adecuado de colores

## Performance

- ✅ Lazy loading en imágenes
- ✅ Priority loading solo en banner principal
- ✅ Sizes attribute para responsive images
- ✅ Optimización de queries a Supabase

## Próximas Mejoras

1. **Banner Carousel**: Múltiples banners con rotación automática
2. **Banner Dinámico**: Cargar banners desde base de datos
3. **A/B Testing**: Sistema para probar diferentes banners
4. **Analytics**: Tracking de clicks en banners
5. **Banner por Categoría**: Banners específicos por categoría

---

**Última actualización**: $(Get-Date -Format "yyyy-MM-dd HH:mm")

