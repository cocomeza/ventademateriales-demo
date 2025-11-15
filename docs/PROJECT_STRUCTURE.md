# Estructura del Proyecto - MaterialesYA

Este documento describe la estructura del proyecto y la organización de archivos y carpetas.

## 📁 Estructura de Directorios

```
MaterialesYA/
├── .github/                    # Configuración de GitHub
│   ├── ISSUE_TEMPLATE/        # Templates para issues
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── question.md
│   ├── workflows/             # GitHub Actions
│   │   └── ci.yml            # CI/CD pipeline
│   └── pull_request_template.md
│
├── app/                        # App Router de Next.js 14
│   ├── admin/                 # Panel de administración
│   │   ├── categories/
│   │   ├── customer-prices/
│   │   ├── customers/
│   │   ├── discounts/
│   │   ├── import-export/
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── stock-alerts/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                   # API Routes
│   │   └── auth/
│   │       └── callback/
│   ├── auth/                  # Páginas de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── cart/                  # Página del carrito
│   ├── orders/                # Página de pedidos
│   ├── products/              # Páginas de productos
│   │   └── [id]/
│   ├── wishlist/              # Página de lista de deseos
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página principal
│   └── globals.css            # Estilos globales
│
├── components/                 # Componentes React reutilizables
│   ├── admin/                 # Componentes del panel admin
│   │   ├── categories-admin.tsx
│   │   ├── customer-prices-admin.tsx
│   │   ├── customers-admin.tsx
│   │   ├── discounts-admin.tsx
│   │   ├── import-export-admin.tsx
│   │   ├── inventory-management.tsx
│   │   ├── order-status-history.tsx
│   │   ├── orders-admin.tsx
│   │   ├── products-admin.tsx
│   │   └── stock-alerts.tsx
│   ├── auth/                  # Componentes de autenticación
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── reset-password-form.tsx
│   ├── ui/                    # Componentes UI (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── use-toast.ts
│   ├── cart-view.tsx
│   ├── checkout-dialog.tsx
│   ├── navbar.tsx
│   ├── orders-history.tsx
│   ├── product-card.tsx
│   ├── product-catalog.tsx
│   ├── product-comparator.tsx
│   ├── product-detail.tsx
│   └── wishlist-view.tsx
│
├── docs/                      # Documentación del proyecto
│   ├── DEPLOYMENT.md          # Guía de despliegue
│   ├── INSTALLATION.md        # Guía de instalación
│   ├── PROJECT_STRUCTURE.md   # Este archivo
│   └── README.md              # Índice de documentación
│
├── lib/                       # Utilidades y configuraciones
│   ├── supabase/             # Clientes de Supabase
│   │   ├── client.ts         # Cliente del lado del cliente
│   │   └── server.ts          # Cliente del lado del servidor
│   ├── auth.ts               # Utilidades de autenticación
│   ├── mock-data.ts          # Datos mock para desarrollo
│   ├── pricing.ts            # Lógica de precios
│   └── utils.ts              # Funciones utilitarias
│
├── store/                     # Estado global (Zustand)
│   └── cart-store.ts         # Store del carrito de compras
│
├── supabase/                  # Scripts SQL
│   ├── schema.sql            # Esquema principal de BD
│   ├── schema-roles-categories.sql
│   └── seed.sql              # Datos de ejemplo
│
├── tests/                     # Tests
│   ├── e2e/                  # Tests end-to-end (Playwright)
│   │   └── example.spec.ts
│   └── unit/                 # Tests unitarios (Vitest)
│       └── cart-store.test.ts
│
├── types/                     # Tipos TypeScript
│   └── index.ts              # Definiciones de tipos
│
├── .editorconfig             # Configuración del editor
├── .gitignore                # Archivos ignorados por Git
├── .nvmrc                    # Versión de Node.js
├── CHANGELOG.md              # Historial de cambios
├── CONTRIBUTING.md           # Guía de contribución
├── LICENSE                   # Licencia MIT
├── README.md                 # Documentación principal
├── SECURITY.md               # Política de seguridad
├── instrumentation.ts        # Instrumentación de Sentry
├── next.config.js            # Configuración de Next.js
├── package.json              # Dependencias y scripts
├── playwright.config.ts      # Configuración de Playwright
├── postcss.config.js         # Configuración de PostCSS
├── sentry.client.config.ts   # Configuración de Sentry (cliente)
├── sentry.edge.config.ts     # Configuración de Sentry (edge)
├── sentry.server.config.ts   # Configuración de Sentry (servidor)
├── tailwind.config.ts        # Configuración de Tailwind CSS
├── tsconfig.json             # Configuración de TypeScript
├── vercel.json               # Configuración de Vercel
└── vitest.config.ts          # Configuración de Vitest
```

## 📂 Descripción de Carpetas Principales

### `/app`
Contiene todas las rutas y páginas de la aplicación usando el App Router de Next.js 14. Cada carpeta representa una ruta.

### `/components`
Componentes React reutilizables organizados por funcionalidad:
- `admin/`: Componentes específicos del panel de administración
- `auth/`: Componentes relacionados con autenticación
- `ui/`: Componentes UI base (shadcn/ui)

### `/lib`
Utilidades y configuraciones:
- `supabase/`: Clientes de Supabase para cliente y servidor
- Funciones utilitarias y helpers

### `/store`
Estado global usando Zustand. Actualmente contiene el store del carrito.

### `/types`
Definiciones de tipos TypeScript compartidas en toda la aplicación.

### `/supabase`
Scripts SQL para configurar la base de datos:
- `schema.sql`: Esquema principal
- `seed.sql`: Datos de ejemplo

### `/tests`
Tests organizados por tipo:
- `e2e/`: Tests end-to-end con Playwright
- `unit/`: Tests unitarios con Vitest

### `/docs`
Documentación del proyecto:
- Guías de instalación y despliegue
- Estructura del proyecto
- Índice de documentación

## 🔧 Archivos de Configuración

### Root Level
- `package.json`: Dependencias y scripts npm
- `tsconfig.json`: Configuración de TypeScript
- `next.config.js`: Configuración de Next.js
- `tailwind.config.ts`: Configuración de Tailwind CSS
- `vercel.json`: Configuración para despliegue en Vercel

### Testing
- `vitest.config.ts`: Configuración de Vitest
- `playwright.config.ts`: Configuración de Playwright

### Monitoreo
- `sentry.*.config.ts`: Configuración de Sentry para diferentes entornos

## 📝 Convenciones

### Nombres de Archivos
- Componentes: PascalCase (ej: `ProductCard.tsx`)
- Utilidades: camelCase (ej: `formatPrice.ts`)
- Páginas: `page.tsx` (convención de Next.js)
- Layouts: `layout.tsx` (convención de Next.js)

### Estructura de Componentes
```typescript
// Imports
import { ... } from '...'

// Types/Interfaces
interface Props { ... }

// Component
export function ComponentName({ ... }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return (...)
}
```

## 🚀 Próximos Pasos

Para comenzar a trabajar con el proyecto:
1. Lee [INSTALLATION.md](./INSTALLATION.md)
2. Revisa [CONTRIBUTING.md](../CONTRIBUTING.md)
3. Explora los componentes en `/components`
4. Revisa los tipos en `/types`

---

¿Tienes preguntas sobre la estructura? Abre un [issue](https://github.com/tu-usuario/MaterialesYA/issues) o consulta la [documentación](./README.md).

