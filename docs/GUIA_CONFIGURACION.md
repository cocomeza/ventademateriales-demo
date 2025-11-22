# Guía Paso a Paso: Configuración de CI/CD

Esta guía te ayudará a configurar los secrets de GitHub y probar los workflows de CI/CD.

## Paso 1: Configurar Secrets en GitHub

### 1.1 Acceder a la Configuración de Secrets

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/MaterialesYA`
2. Haz clic en **Settings** (Configuración) en la parte superior del repositorio
3. En el menú lateral izquierdo, ve a **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**

### 1.2 Obtener Credenciales de Vercel

#### Obtener VERCEL_TOKEN:
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en tu avatar (arriba a la derecha) → **Settings**
3. Ve a la pestaña **Tokens**
4. Haz clic en **Create Token**
5. Dale un nombre descriptivo (ej: "MaterialesYA CI/CD")
6. Selecciona el scope **Full Account** o al menos **Deployments: Read & Write**
7. Copia el token generado (solo se muestra una vez)

#### Obtener VERCEL_ORG_ID y VERCEL_PROJECT_ID:
1. En Vercel Dashboard, ve a tu proyecto (o créalo si no existe)
2. Ve a **Settings** del proyecto
3. En la sección **General**, encontrarás:
   - **Team ID** o **Account ID** → Este es tu `VERCEL_ORG_ID`
   - **Project ID** → Este es tu `VERCEL_PROJECT_ID`
4. También puedes encontrarlos en la URL cuando estás en la configuración del proyecto

**Alternativa rápida:**
```bash
# Instala Vercel CLI si no lo tienes
npm i -g vercel

# Inicia sesión
vercel login

# Vincula tu proyecto (esto mostrará los IDs)
vercel link
```

### 1.3 Obtener Credenciales de Supabase

#### Para Producción:
1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️) → **API**
4. Copia:
   - **Project URL** → Este es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Este es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Para Staging (opcional):
Si tienes un proyecto separado para staging, repite el proceso anterior y guarda los valores con el sufijo `_STAGING`.

### 1.4 Obtener Credenciales de Sentry (Opcional)

1. Ve a [Sentry Dashboard](https://sentry.io)
2. Ve a **Settings** → **Organizations** → Selecciona tu organización
3. El nombre de la organización es tu `SENTRY_ORG`
4. Ve a **Projects** → Selecciona tu proyecto → El nombre es tu `SENTRY_PROJECT`
5. Para el token:
   - Ve a **Settings** → **Auth Tokens**
   - Crea un nuevo token con permisos: `project:releases`, `org:read`
   - Copia el token → Este es tu `SENTRY_AUTH_TOKEN`

### 1.5 Agregar Secrets en GitHub

Para cada secret, sigue estos pasos:

1. En GitHub, ve a **Settings** → **Secrets and variables** → **Actions**
2. Haz clic en **New repository secret**
3. Ingresa el **Name** (exactamente como se muestra abajo)
4. Ingresa el **Value** (pega el valor correspondiente)
5. Haz clic en **Add secret**

**Secrets a agregar:**

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL_STAGING (opcional)
NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING (opcional)
SENTRY_ORG (opcional)
SENTRY_PROJECT (opcional)
SENTRY_AUTH_TOKEN (opcional)
```

## Paso 2: Verificar Configuración Local

Antes de probar en GitHub, verifica que todo funciona localmente:

### 2.1 Verificar Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 2.2 Ejecutar Tests Localmente

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Verificar que el código compila
npm run lint
npx tsc --noEmit

# 3. Ejecutar tests unitarios
npm run test:unit

# 4. Ejecutar tests E2E (requiere que la app esté corriendo)
# Primero inicia el servidor de desarrollo en otra terminal:
npm run dev

# Luego en otra terminal ejecuta:
npm run test:e2e

# 5. Verificar que el build funciona
npm run build
```

Si todos estos comandos funcionan sin errores, estás listo para probar en GitHub.

## Paso 3: Probar los Workflows en GitHub

### 3.1 Probar CI (Continuous Integration)

1. Haz un pequeño cambio en el código (por ejemplo, agrega un comentario)
2. Haz commit y push a cualquier rama:
   ```bash
   git add .
   git commit -m "test: probar CI workflow"
   git push origin tu-rama
   ```
3. Ve a GitHub → **Actions** en la parte superior del repositorio
4. Deberías ver un workflow ejecutándose llamado "CI"
5. Haz clic en él para ver el progreso
6. Espera a que termine (puede tomar 5-10 minutos)

### 3.2 Probar Deploy a Staging

1. Asegúrate de tener una rama `develop`:
   ```bash
   git checkout -b develop
   git push origin develop
   ```
2. O si ya existe, cambia a ella y haz un cambio:
   ```bash
   git checkout develop
   # Haz un cambio pequeño
   git add .
   git commit -m "test: probar deploy staging"
   git push origin develop
   ```
3. Ve a **Actions** en GitHub
4. Deberías ver el workflow "Deploy to Staging" ejecutándose
5. Una vez completado, deberías tener un preview en Vercel

### 3.3 Probar Deploy a Producción

⚠️ **Importante**: Solo haz esto cuando estés seguro de que todo funciona correctamente.

1. Mergea `develop` a `main`:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```
2. Ve a **Actions** en GitHub
3. El workflow "Deploy to Production" debería ejecutarse
4. Si configuraste protección de rama, puede requerir aprobación manual

## Paso 4: Verificar que Todo Funciona

### 4.1 Verificar Workflows

1. Ve a **Actions** en GitHub
2. Todos los workflows deberían tener un checkmark verde ✅
3. Si hay errores, haz clic en el workflow fallido para ver los logs

### 4.2 Verificar Despliegues

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Deberías ver tus despliegues:
   - **Staging**: Preview de la rama `develop`
   - **Production**: Despliegue de la rama `main`

### 4.3 Verificar Tests

1. En GitHub Actions, los tests deberían pasar
2. Puedes ver los reportes de cobertura y E2E en los artifacts del workflow

## Troubleshooting Común

### Error: "Secret not found"
- Verifica que agregaste el secret con el nombre exacto (case-sensitive)
- Asegúrate de que esté en **Repository secrets**, no en **Environment secrets**

### Error: "Vercel deployment failed"
- Verifica que `VERCEL_TOKEN` tenga los permisos correctos
- Asegúrate de que `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` sean correctos
- Verifica que el proyecto exista en Vercel

### Error: "Tests failed"
- Ejecuta los tests localmente primero para ver el error específico
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs del workflow para más detalles

### Error: "Build failed"
- Verifica que el código compile localmente (`npm run build`)
- Revisa los logs del workflow para ver el error específico
- Asegúrate de que todas las dependencias estén en `package.json`

## Comandos Útiles

```bash
# Ver el estado de los workflows localmente (simulado)
npm run lint          # Lint
npm run test:unit     # Tests unitarios
npm run test:e2e      # Tests E2E
npm run build         # Build

# Ver logs de GitHub Actions desde la terminal (requiere GitHub CLI)
gh run list           # Listar workflows recientes
gh run watch          # Ver workflow en tiempo real
gh run view           # Ver detalles del último workflow
```

## Siguiente Paso

Una vez que todo esté configurado y funcionando:

1. ✅ Los workflows se ejecutarán automáticamente en cada push
2. ✅ Los tests se ejecutarán antes de cada despliegue
3. ✅ Los despliegues a staging/producción serán automáticos
4. ✅ Tendrás monitoreo de errores con Sentry (si lo configuraste)

¡Listo! Tu proyecto ahora tiene CI/CD completamente configurado. 🚀

