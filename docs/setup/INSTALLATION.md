# Guía de Instalación - MaterialesYA

Esta guía te ayudará a configurar y ejecutar la aplicación MaterialesYA paso a paso.

## Requisitos Previos

- Node.js 18+ instalado
- npm, yarn o pnpm
- Cuenta de Supabase (gratuita)
- (Opcional) Cuenta de Sentry para monitoreo de errores

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Configurar Supabase

### 2.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anónima (anon key)

### 2.2 Configurar Base de Datos

1. Ve a SQL Editor en tu proyecto de Supabase
2. Ejecuta el script completo:
   - `supabase/setup-complete.sql` - Script consolidado que crea todas las tablas, políticas, triggers e índices
   - `supabase/seed-data.sql` - (Opcional) Agrega datos de ejemplo (categorías y productos)
   
   **📖 Guía detallada:** Consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instrucciones paso a paso completas

### 2.3 Configurar Autenticación

En Supabase Dashboard:
- Ve a Authentication > Settings
- Configura las URLs de redirección:
  - `http://localhost:3000/auth/callback` (desarrollo)
  - `https://tu-dominio.com/auth/callback` (producción)

## Paso 3: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus credenciales:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon

# WhatsApp Business Number (formato: código_país + número sin espacios ni símbolos)
# Ejemplo para Argentina: 5491123456789
# Ejemplo para México: 5215512345678
NEXT_PUBLIC_WHATSAPP_NUMBER=5491123456789

# Sentry (opcional)
NEXT_PUBLIC_SENTRY_DSN=tu-sentry-dsn
SENTRY_ORG=tu-org
SENTRY_PROJECT=tu-proyecto
SENTRY_AUTH_TOKEN=tu-token
```

## Paso 4: Ejecutar la Aplicación

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run start
```

## Paso 5: Testing

### Tests Unitarios (Vitest)

```bash
npm run test
```

### Tests End-to-End (Playwright)

Primero instala los navegadores de Playwright:

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

## Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── auth/              # Páginas de autenticación
│   ├── cart/             # Página del carrito
│   ├── orders/           # Página de pedidos
│   └── page.tsx          # Página principal
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticación
│   ├── ui/               # Componentes UI (shadcn/ui)
│   └── ...               # Otros componentes
├── lib/                   # Utilidades y configuraciones
│   ├── supabase/         # Clientes de Supabase
│   └── utils.ts          # Funciones utilitarias
├── store/                 # Estado global (Zustand)
├── types/                 # Tipos TypeScript
├── tests/                 # Tests
│   ├── e2e/              # Tests end-to-end
│   └── unit/             # Tests unitarios
└── supabase/              # Scripts SQL
    ├── schema.sql        # Esquema de base de datos
    └── seed.sql          # Datos de ejemplo
```

## Solución de Problemas

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"

Asegúrate de que el archivo `.env.local` existe y tiene las variables correctas. Reinicia el servidor de desarrollo después de crear/modificar `.env.local`.

### Error de autenticación en Supabase

Verifica que las URLs de redirección estén configuradas correctamente en Supabase Dashboard.

### Los productos no se muestran

1. Verifica que ejecutaste el script `schema.sql` en Supabase
2. Verifica que hay productos en la tabla `products`
3. Revisa la consola del navegador para errores

### El carrito no persiste

El carrito usa localStorage del navegador. Asegúrate de que las cookies/localStorage no estén bloqueadas.

### Error al ejecutar tests

Asegúrate de que todas las dependencias estén instaladas:
```bash
npm install
npx playwright install
```

## Próximos Pasos

- Personaliza los estilos en `app/globals.css`
- Agrega más productos en Supabase
- Configura Sentry para monitoreo de errores
- Personaliza el mensaje de WhatsApp en `lib/utils.ts`
- Revisa la [guía de despliegue](./DEPLOYMENT.md) para publicar tu aplicación

## Soporte

Si encuentras problemas, revisa:
- La consola del navegador (F12)
- Los logs del servidor
- La documentación de [Next.js](https://nextjs.org/docs)
- La documentación de [Supabase](https://supabase.com/docs)
- Los [issues de GitHub](https://github.com/tu-usuario/MaterialesYA/issues)

