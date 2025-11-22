# 🔧 Configuración Técnica de CI/CD

Documentación técnica detallada de los workflows de GitHub Actions.

## Workflows Disponibles

### 1. CI (Continuous Integration)
**Archivo:** `.github/workflows/ci.yml`

**Triggers:**
- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Jobs:**
- `lint-and-typecheck`: Valida código con ESLint y TypeScript
- `unit-tests`: Ejecuta tests unitarios con Vitest
- `e2e-tests`: Ejecuta tests E2E con Playwright
- `build`: Construye la aplicación

### 2. Deploy Staging
**Archivo:** `.github/workflows/deploy-staging.yml`

**Triggers:**
- Push a `develop`
- Manual (`workflow_dispatch`)

**Proceso:**
1. Ejecuta tests y lint
2. Construye la aplicación
3. Despliega a Vercel (preview/staging)

### 3. Deploy Production
**Archivo:** `.github/workflows/deploy-production.yml`

**Triggers:**
- Push a `main`
- Manual (`workflow_dispatch`) con aprobación

**Proceso:**
1. Ejecuta todos los tests
2. Construye la aplicación
3. Despliega a Vercel (producción)

## Variables de Entorno Requeridas

### Secrets de GitHub

**Requeridos:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Opcionales:**
- `NEXT_PUBLIC_SUPABASE_URL_STAGING`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

## Estructura de los Workflows

```
.github/workflows/
├── ci.yml                  # CI continuo
├── deploy-staging.yml      # Deploy a staging
└── deploy-production.yml   # Deploy a producción
```

## Flujo de Trabajo Recomendado

1. **Desarrollo**: Trabaja en ramas feature
2. **Staging**: Merge a `develop` → Deploy automático a staging
3. **Producción**: Merge de `develop` a `main` → Deploy automático a producción

## Monitoreo

Los workflows envían notificaciones cuando:
- Un workflow falla
- Un despliegue se completa
- Se requiere aprobación manual (solo producción)

Ver estado en: GitHub → **Actions**

