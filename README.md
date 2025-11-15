# MaterialesYA 🏗️

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Plataforma web moderna para la gestión y venta de materiales de construcción. Desarrollada con Next.js 14, React, TypeScript y Supabase.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### Para Clientes
- 🛍️ **Catálogo de productos** con filtros avanzados por categoría, precio y disponibilidad
- 🔍 **Búsqueda y comparación** de productos
- 🛒 **Carrito de compras** con estado persistente
- 💝 **Lista de deseos** para guardar productos favoritos
- 📱 **Checkout vía WhatsApp** para enviar pedidos directamente
- 📦 **Seguimiento de pedidos** con historial completo
- 👤 **Autenticación segura** con Supabase Auth

### Para Administradores
- 📊 **Panel de administración** completo
- 📦 **Gestión de inventario** con alertas de stock bajo
- 💰 **Precios personalizados** por cliente
- 🏷️ **Sistema de descuentos** flexible (porcentaje, fijo, volumen)
- 📈 **Gestión de categorías** y productos
- 📋 **Gestión de pedidos** con historial de estados
- 📥 **Importación/Exportación** de datos (CSV)
- 👥 **Gestión de clientes**

## 🛠️ Tecnologías

- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Supabase](https://supabase.com/)** - Backend, base de datos y autenticación
- **[Zustand](https://github.com/pmndrs/zustand)** - Gestión de estado global
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilos
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI reutilizables
- **[Vitest](https://vitest.dev/)** - Framework de testing unitario
- **[Playwright](https://playwright.dev/)** - Testing end-to-end
- **[Sentry](https://sentry.io/)** - Monitoreo de errores en producción

## 📦 Requisitos Previos

- Node.js 18 o superior
- npm, yarn o pnpm
- Cuenta de [Supabase](https://supabase.com) (gratuita)
- (Opcional) Cuenta de [Sentry](https://sentry.io/) para monitoreo

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/MaterialesYA.git
   cd MaterialesYA
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
   NEXT_PUBLIC_WHATSAPP_NUMBER=5491123456789
   ```

4. **Configurar Supabase**
   
   Ve a [Supabase Dashboard](https://app.supabase.com) y ejecuta el script SQL:
   - `supabase/setup-complete.sql` - Script completo que crea todas las tablas, políticas y configuraciones
   - `supabase/seed-data.sql` - (Opcional) Datos de ejemplo
   
   **📖 Guía detallada:** Consulta [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) para instrucciones paso a paso

   Configura las URLs de redirección en Authentication > Settings:
   - Desarrollo: `http://localhost:3000/auth/callback`
   - Producción: `https://tu-dominio.com/auth/callback`

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Sí |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp Business | Sí |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN de Sentry para monitoreo | No |
| `SENTRY_ORG` | Organización de Sentry | No |
| `SENTRY_PROJECT` | Proyecto de Sentry | No |
| `SENTRY_AUTH_TOKEN` | Token de autenticación de Sentry | No |

Para más detalles, consulta la [Guía de Instalación](./docs/INSTALLATION.md) o la [Guía de Despliegue](./docs/DEPLOYMENT.md)

## 🚢 Despliegue

### Despliegue en Vercel (Recomendado)

1. **Conectar con GitHub**
   - Haz push de tu código a GitHub
   - Ve a [Vercel](https://vercel.com) e importa tu repositorio

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables de `.env.local`

3. **Desplegar**
   - Vercel detectará automáticamente Next.js
   - El despliegue se realizará automáticamente en cada push a `main`

### Despliegue Manual

```bash
npm run build
npm run start
```

## 📁 Estructura del Proyecto

```
MaterialesYA/
├── app/                      # App Router de Next.js
│   ├── admin/               # Rutas del panel de administración
│   ├── api/                 # API Routes
│   ├── auth/                # Páginas de autenticación
│   ├── cart/                # Página del carrito
│   ├── orders/              # Página de pedidos
│   ├── products/            # Páginas de productos
│   ├── wishlist/            # Página de lista de deseos
│   ├── layout.tsx           # Layout principal
│   └── globals.css          # Estilos globales
├── components/              # Componentes React
│   ├── admin/              # Componentes del panel admin
│   ├── auth/               # Componentes de autenticación
│   ├── ui/                 # Componentes UI (shadcn/ui)
│   └── ...                 # Otros componentes
├── lib/                    # Utilidades y configuraciones
│   ├── supabase/          # Clientes de Supabase
│   ├── auth.ts            # Utilidades de autenticación
│   ├── pricing.ts         # Lógica de precios
│   ├── utils.ts           # Funciones utilitarias
│   └── mock-data.ts       # Datos mock para desarrollo
├── store/                 # Estado global (Zustand)
│   └── cart-store.ts      # Store del carrito
├── types/                 # Tipos TypeScript
│   └── index.ts           # Definiciones de tipos
├── supabase/              # Scripts SQL
│   ├── schema.sql         # Esquema principal
│   ├── schema-roles-categories.sql
│   └── seed.sql           # Datos de ejemplo
├── tests/                 # Tests
│   ├── e2e/              # Tests end-to-end (Playwright)
│   └── unit/             # Tests unitarios (Vitest)
├── public/               # Archivos estáticos
├── next.config.js        # Configuración de Next.js
├── tailwind.config.ts    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
└── vercel.json           # Configuración de Vercel
```

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta tests unitarios con Vitest |
| `npm run test:e2e` | Ejecuta tests end-to-end con Playwright |
| `npm run test:e2e:ui` | Ejecuta tests e2e con interfaz visual |

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
npm run test
```

### Tests End-to-End (Playwright)

Primero instala los navegadores:
```bash
npx playwright install
```

Luego ejecuta los tests:
```bash
npm run test:e2e
```

Para ejecutar con interfaz visual:
```bash
npm run test:e2e:ui
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Para más detalles, consulta [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

- Abre un [issue](https://github.com/tu-usuario/MaterialesYA/issues)
- Consulta la [documentación](./INSTALLATION.md)
- Revisa los [logs de Sentry](https://sentry.io) (si está configurado)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el excelente framework
- [Supabase](https://supabase.com/) por el backend como servicio
- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- Todos los contribuidores y la comunidad open source

---

Hecho con ❤️ usando Next.js y Supabase
