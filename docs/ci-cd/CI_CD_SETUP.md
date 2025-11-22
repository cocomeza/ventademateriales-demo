# Configuración de CI/CD con GitHub Actions

Este proyecto incluye pipelines de CI/CD automatizados usando GitHub Actions para validar código, ejecutar tests y desplegar en diferentes entornos.

## Workflows Disponibles

### 1. CI (Continuous Integration)
**Archivo:** `.github/workflows/ci.yml`

Se ejecuta automáticamente en:
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Jobs incluidos:**
- **Lint & Type Check**: Valida el código con ESLint y TypeScript
- **Unit Tests**: Ejecuta tests unitarios con Vitest
- **E2E Tests**: Ejecuta tests end-to-end con Playwright
- **Build**: Construye la aplicación para verificar que compila correctamente

### 2. Deploy Staging
**Archivo:** `.github/workflows/deploy-staging.yml`

Se ejecuta en:
- Push a `develop`
- Manualmente mediante `workflow_dispatch`

**Proceso:**
1. Ejecuta tests unitarios y lint
2. Construye la aplicación
3. Despliega a Vercel (preview/staging)

### 3. Deploy Production
**Archivo:** `.github/workflows/deploy-production.yml`

Se ejecuta en:
- Push a `main`
- Manualmente mediante `workflow_dispatch` (requiere aprobación)

**Proceso:**
1. Ejecuta todos los tests (unitarios, lint, e2e)
2. Construye la aplicación
3. Despliega a Vercel (producción)

## Configuración de Secrets

Para que los workflows funcionen correctamente, necesitas configurar los siguientes secrets en GitHub:

### Secrets Requeridos

1. **Vercel**
   - `VERCEL_TOKEN`: Token de autenticación de Vercel
   - `VERCEL_ORG_ID`: ID de tu organización en Vercel
   - `VERCEL_PROJECT_ID`: ID del proyecto en Vercel

2. **Supabase (Producción)**
   - `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima de Supabase

3. **Supabase (Staging)**
   - `NEXT_PUBLIC_SUPABASE_URL_STAGING`: URL del proyecto Supabase de staging
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING`: Clave anónima de staging

4. **Sentry (Opcional)**
   - `SENTRY_ORG`: Organización de Sentry
   - `SENTRY_PROJECT`: Proyecto de Sentry
   - `SENTRY_AUTH_TOKEN`: Token de autenticación de Sentry

## Cómo Configurar los Secrets

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret**
4. Agrega cada secret con su nombre y valor correspondiente

## Obtener Credenciales

### Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Tokens**
3. Crea un nuevo token y cópialo
4. Para obtener `ORG_ID` y `PROJECT_ID`:
   - Ve a la configuración de tu proyecto
   - Los encontrarás en la URL o en la configuración del proyecto

### Supabase
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Settings** → **API**
3. Copia la **URL** y la **anon/public key**

## Flujo de Trabajo Recomendado

1. **Desarrollo**: Trabaja en ramas feature
2. **Staging**: Merge a `develop` → Despliegue automático a staging
3. **Producción**: Merge de `develop` a `main` → Despliegue automático a producción

## Verificación Local

Antes de hacer push, puedes ejecutar localmente los mismos comandos que ejecutan los workflows:

```bash
# Lint y type check
npm run lint
npx tsc --noEmit

# Tests unitarios
npm run test:unit

# Tests E2E
npm run test:e2e

# Build
npm run build
```

## Troubleshooting

### Los workflows fallan en CI pero funcionan localmente
- Verifica que todos los secrets estén configurados
- Asegúrate de que las variables de entorno sean correctas
- Revisa los logs del workflow para más detalles

### El despliegue falla
- Verifica que `VERCEL_TOKEN` sea válido
- Asegúrate de que `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` sean correctos
- Revisa los permisos del token de Vercel

### Los tests E2E fallan en CI
- Asegúrate de que Playwright esté instalado correctamente
- Verifica que las variables de entorno de Supabase estén configuradas
- Revisa los screenshots y logs del reporte de Playwright

## Monitoreo

Los workflows envían notificaciones automáticas cuando:
- Un workflow falla
- Un despliegue se completa exitosamente
- Se requiere aprobación manual (solo producción)

Puedes ver el estado de los workflows en la pestaña **Actions** de tu repositorio en GitHub.

