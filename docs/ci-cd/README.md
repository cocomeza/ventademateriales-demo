# 🚀 Guía Completa de CI/CD

**Todo lo que necesitas saber para configurar y usar CI/CD en este proyecto.**

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Subir Cambios a GitHub](#subir-cambios-a-github)
3. [Configurar Secrets](#configurar-secrets)
4. [Probar los Workflows](#probar-los-workflows)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Inicio Rápido

### ¿Qué necesito hacer ahora?

**Si acabas de agregar CI/CD al proyecto:**

1. ✅ **Subir cambios a GitHub** (5 minutos)
2. ✅ **Configurar secrets** (15 minutos)
3. ✅ **Probar workflows** (10 minutos)

**Total: ~30 minutos**

---

## 📤 Subir Cambios a GitHub

### Paso 1: Verificar que todo funciona localmente

```bash
# Verificar configuración
npm run check:setup

# Ejecutar tests
npm run test:unit

# Verificar que compila
npm run build
```

### Paso 2: Subir los cambios

```bash
# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "feat: agregar CI/CD completo, Framer Motion y tests de stock"

# Subir a GitHub
git push origin main
```

### Paso 3: Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Ve a la pestaña **Actions**
3. Deberías ver el workflow "CI" ejecutándose automáticamente

---

## 🔐 Configurar Secrets

Los workflows necesitan credenciales para funcionar. Debes agregarlas en GitHub.

### Paso 1: Acceder a Secrets

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret**

### Paso 2: Agregar Secrets Requeridos

Agrega estos secrets uno por uno:

| Secret | Dónde obtenerlo |
|--------|----------------|
| `VERCEL_TOKEN` | Vercel Dashboard → Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Vercel Dashboard → Proyecto → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel Dashboard → Proyecto → Settings → General → Project ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |

### Paso 3: Obtener Credenciales

#### Vercel (3 secrets)

**VERCEL_TOKEN:**
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Avatar (arriba derecha) → **Settings** → **Tokens**
3. **Create Token** → Nombre: "MaterialesYA CI/CD"
4. Scope: **Full Account** o **Deployments: Read & Write**
5. Copia el token (solo se muestra una vez)

**VERCEL_ORG_ID y VERCEL_PROJECT_ID:**
1. En Vercel Dashboard, ve a tu proyecto
2. **Settings** → **General**
3. Copia **Team ID** (ORG_ID) y **Project ID**

**Alternativa rápida:**
```bash
npm i -g vercel
vercel login
vercel link  # Esto mostrará los IDs
```

#### Supabase (2 secrets)

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. **Settings** (⚙️) → **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Paso 4: Secrets Opcionales

Si quieres usar staging o Sentry:

**Staging (opcional):**
- `NEXT_PUBLIC_SUPABASE_URL_STAGING`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING`

**Sentry (opcional):**
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

---

## ✅ Probar los Workflows

### Opción 1: Probar CI (Recomendado primero)

1. Haz un pequeño cambio (ej: agregar un comentario)
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "test: probar CI workflow"
   git push origin main
   ```
3. Ve a GitHub → **Actions**
4. Verás el workflow "CI" ejecutándose
5. Espera 5-10 minutos a que termine

### Opción 2: Probar Deploy a Staging

1. Crea o cambia a la rama `develop`:
   ```bash
   git checkout -b develop
   # o si ya existe:
   git checkout develop
   ```

2. Haz un cambio y push:
   ```bash
   git add .
   git commit -m "test: probar deploy staging"
   git push origin develop
   ```

3. Ve a **Actions** → Verás "Deploy to Staging"

### Opción 3: Probar Deploy a Producción

⚠️ **Solo cuando estés seguro de que todo funciona**

```bash
git checkout main
git merge develop
git push origin main
```

---

## 🎯 ¿Qué Hacen los Workflows?

### Workflow: CI
**Se ejecuta en:** Cada push a `main` o `develop`

**Qué hace:**
- ✅ Valida código con ESLint
- ✅ Verifica tipos con TypeScript
- ✅ Ejecuta tests unitarios
- ✅ Ejecuta tests E2E
- ✅ Construye la aplicación

### Workflow: Deploy Staging
**Se ejecuta en:** Push a `develop`

**Qué hace:**
- ✅ Ejecuta tests
- ✅ Construye la aplicación
- ✅ Despliega a Vercel (preview/staging)

### Workflow: Deploy Production
**Se ejecuta en:** Push a `main`

**Qué hace:**
- ✅ Ejecuta todos los tests
- ✅ Construye la aplicación
- ✅ Despliega a Vercel (producción)

---

## 🆘 Troubleshooting

### Los workflows fallan en GitHub pero funcionan localmente

**Causa común:** Secrets no configurados o incorrectos

**Solución:**
1. Verifica que todos los secrets estén en GitHub
2. Revisa los nombres (son case-sensitive)
3. Revisa los logs del workflow para ver el error específico

### Error: "Secret not found"

**Solución:**
- Verifica que el secret esté en **Repository secrets**, no en Environment secrets
- Verifica que el nombre sea exacto (case-sensitive)

### Error: "Vercel deployment failed"

**Solución:**
- Verifica que `VERCEL_TOKEN` tenga permisos correctos
- Verifica que `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` sean correctos
- Verifica que el proyecto exista en Vercel

### No puedo encontrar los IDs de Vercel

**Solución:**
```bash
npm i -g vercel
vercel login
vercel link  # Esto mostrará los IDs
```

### Los tests fallan

**Solución:**
1. Ejecuta `npm run test:unit` localmente primero
2. Revisa los logs del workflow para ver el error específico
3. Verifica que las variables de entorno estén configuradas

---

## 📚 Comandos Útiles

```bash
# Verificar configuración local
npm run check:setup

# Verificar todo antes de push
npm run check:all

# Ejecutar tests
npm run test:unit      # Tests unitarios
npm run test:e2e       # Tests E2E
npm run test:all       # Todos los tests

# Ver workflows (requiere GitHub CLI)
gh run list            # Listar workflows
gh run watch           # Ver en tiempo real
```

---

## ✅ Checklist Final

Antes de considerar que todo está configurado:

- [ ] Subí los cambios a GitHub
- [ ] Configuré todos los secrets requeridos
- [ ] El workflow CI se ejecuta correctamente
- [ ] Los tests pasan en GitHub Actions
- [ ] El build funciona en GitHub Actions
- [ ] (Opcional) El deploy a staging funciona
- [ ] (Opcional) El deploy a producción funciona

---

## 🎉 ¡Listo!

Una vez completado todo:

- ✅ Cada push activará automáticamente los workflows
- ✅ Los tests se ejecutarán antes de cada despliegue
- ✅ Los despliegues serán automáticos
- ✅ Tendrás monitoreo de errores

**¿Necesitas más ayuda?** Revisa los logs de los workflows en GitHub Actions o la documentación técnica en [CI_CD_SETUP.md](../CI_CD_SETUP.md).

