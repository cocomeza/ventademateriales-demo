# Sistema de Diseño - MaterialesYA

## Paleta de Colores

Basado en las imágenes de referencia proporcionadas, la plataforma utiliza una paleta de colores inspirada en materiales de construcción.

### Colores Principales

- **Naranja Vibrante (Primary)**: `hsl(15, 100%, 60%)` - `#FF6B35`
  - Color principal de la marca
  - Usado en botones, badges, y elementos destacados
  - Inspirado en herramientas y materiales de construcción

- **Blanco Limpio (Background)**: `hsl(0, 0%, 100%)` - `#FFFFFF`
  - Fondo principal de la aplicación
  - Cards y contenedores principales

- **Gris Cálido/Beige (Secondary/Muted)**: `hsl(30, 10%, 96%)` - `#F7F5F3`
  - Fondos secundarios
  - Elementos muted y deshabilitados
  - Inspirado en superficies de trabajo y papel

- **Amarillo (Accent)**: `hsl(45, 100%, 55%)` - `#FFD700`
  - Acentos y elementos destacados
  - Inspirado en herramientas amarillas de construcción

### Colores de Texto

- **Foreground Principal**: `hsl(20, 14%, 4%)` - Casi negro con tono cálido
- **Foreground Secundario**: `hsl(20, 8%, 40%)` - Gris medio cálido

### Bordes

- **Border**: `hsl(30, 10%, 90%)` - Bordes suaves y cálidos
- **Input Border**: Mismo que border para consistencia

## Patrones y Texturas

### Patrón de Puntos
```css
.pattern-dots
```
- Patrón de puntos sutiles inspirado en las imágenes
- Usado en banners y fondos decorativos

### Patrón de Grid
```css
.pattern-grid
```
- Grid sutil para fondos
- Inspirado en papel cuadriculado de planos

### Gradientes

- **Gradient Orange**: Gradiente naranja vibrante para banners
- **Gradient Warm**: Gradiente cálido beige/blanco para fondos

## Componentes Estilizados

### Navbar
- Fondo blanco con sombra sutil
- Borde inferior con color primary al 10% de opacidad
- Efecto backdrop blur para modernidad

### Cards
- Bordes con color primary al 10% de opacidad
- Sombra suave que aumenta en hover
- Transición suave en bordes y sombras

### Botones
- Primary: Naranja vibrante con sombra
- Outline: Borde naranja que se intensifica en hover
- Ghost: Fondo naranja muy sutil en hover

### Banner Promocional
- Fondo naranja con gradiente
- Patrón de puntos decorativo
- Elementos SVG sutiles de herramientas y construcción

## Tipografía

- Fuente principal: Inter (ya configurada)
- Pesos: Regular (400), Medium (500), Semibold (600), Bold (700)

## Espaciado

- Padding móvil: `px-3 sm:px-4`
- Padding desktop: `px-4 lg:px-6`
- Gaps: `gap-3 sm:gap-4` o `gap-4 sm:gap-6`

## Sombras

- Cards: `shadow-sm` → `shadow-md` en hover
- Botones: `shadow-sm` → `shadow-md` en hover
- Navbar: `shadow-sm` constante

## Bordes Redondeados

- Radio base: `0.5rem` (8px)
- Cards y botones: `rounded-lg` o `rounded-md`
- Badges: `rounded-full`

## Transiciones

- Todas las transiciones usan `transition-all` o `transition-colors`
- Duración estándar: 150-300ms
- Easing: `ease-in-out` (por defecto de Tailwind)

## Inspiración Visual

El diseño está inspirado en:
- Herramientas de construcción sobre fondos naranjas
- Planos y documentos sobre escritorios blancos
- Materiales de construcción organizados
- Estética profesional pero accesible

