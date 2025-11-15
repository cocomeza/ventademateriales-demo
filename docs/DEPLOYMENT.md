# Guía de Despliegue - MaterialesYA

Esta guía te ayudará a desplegar MaterialesYA en diferentes plataformas.

## 📋 Tabla de Contenidos

- [Despliegue en Vercel (Recomendado)](#despliegue-en-vercel-recomendado)
- [Despliegue Manual](#despliegue-manual)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Configuración de Supabase para Producción](#configuración-de-supabase-para-producción)
- [Post-Despliegue](#post-despliegue)

## 🚀 Despliegue en Vercel (Recomendado)

Vercel es la plataforma recomendada para desplegar aplicaciones Next.js ya que está optimizada para este framework.

### Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en GitHub, GitLab o Bitbucket
2. Verifica que el archivo `vercel.json` esté en la raíz del proyecto
3. Asegúrate de que `.env.local` esté en `.gitignore`

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta o inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 3: Configurar Variables de Entorno

En la configuración del proyecto en Vercel:

1. Ve a **Settings** > **Environment Variables**
2. Agrega las siguientes variables:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu clave anónima | Production, Preview, Development |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número de WhatsApp | Production, Preview, Development |
| `NEXT_PUBLIC_SENTRY_DSN` | (Opcional) DSN de Sentry | Production |
| `SENTRY_ORG` | (Opcional) Org de Sentry | Production |
| `SENTRY_PROJECT` | (Opcional) Proyecto de Sentry | Production |
| `SENTRY_AUTH_TOKEN` | (Opcional) Token de Sentry | Production |

### Paso 4: Configurar Build Settings

Vercel detectará automáticamente la configuración, pero puedes verificar:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### Paso 5: Desplegar

1. Haz clic en **Deploy**
2. Espera a que el build termine
3. Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

### Paso 6: Configurar Dominio Personalizado (Opcional)

1. Ve a **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

## 🔧 Despliegue Manual

### Requisitos

- Servidor con Node.js 18+
- Acceso SSH al servidor
- (Opcional) PM2 o similar para gestión de procesos

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/MaterialesYA.git
cd MaterialesYA
```

### Paso 2: Instalar Dependencias

```bash
npm install --production
```

### Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env.production
nano .env.production  # Edita con tus credenciales
```

### Paso 4: Build

```bash
npm run build
```

### Paso 5: Iniciar el Servidor

#### Opción A: Con npm start

```bash
npm start
```

#### Opción B: Con PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "materialesya" -- start

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### Paso 6: Configurar Nginx (Opcional)

Ejemplo de configuración de Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Configuración de Variables de Entorno

### Variables Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
NEXT_PUBLIC_WHATSAPP_NUMBER=5491123456789
```

### Variables Opcionales

```env
NEXT_PUBLIC_SENTRY_DSN=tu-sentry-dsn
SENTRY_ORG=tu-org
SENTRY_PROJECT=tu-proyecto
SENTRY_AUTH_TOKEN=tu-token
NODE_ENV=production
```

## 🗄️ Configuración de Supabase para Producción

### 1. Actualizar URLs de Redirección

En Supabase Dashboard:
1. Ve a **Authentication** > **URL Configuration**
2. Agrega tu URL de producción:
   - `https://tu-dominio.com/auth/callback`
   - `https://tu-proyecto.vercel.app/auth/callback` (si usas Vercel)

### 2. Configurar Políticas RLS

Asegúrate de que las políticas RLS estén configuradas correctamente para producción. Revisa `supabase/schema.sql`.

### 3. Configurar Storage (Si usas imágenes)

Si almacenas imágenes en Supabase Storage:

1. Ve a **Storage** en Supabase Dashboard
2. Crea un bucket público para imágenes de productos
3. Configura las políticas de acceso

## ✅ Post-Despliegue

### Verificaciones

- [ ] La aplicación carga correctamente
- [ ] La autenticación funciona
- [ ] Los productos se muestran
- [ ] El carrito funciona
- [ ] El checkout vía WhatsApp funciona
- [ ] Las variables de entorno están configuradas
- [ ] Los logs no muestran errores

### Monitoreo

1. **Configurar Sentry** (si está habilitado)
   - Verifica que los errores se reporten correctamente
   - Configura alertas

2. **Configurar Analytics** (Opcional)
   - Google Analytics
   - Vercel Analytics

3. **Configurar Backups**
   - Configura backups automáticos en Supabase
   - Considera backups de la base de datos

### Optimizaciones

1. **Imágenes**
   - Usa Next.js Image Optimization
   - Optimiza imágenes antes de subirlas

2. **Performance**
   - Habilita caching en Vercel
   - Configura CDN si es necesario

3. **SEO**
   - Configura meta tags
   - Agrega sitemap.xml
   - Configura robots.txt

## 🔄 Actualizaciones

### En Vercel

Las actualizaciones se despliegan automáticamente cuando haces push a la rama principal.

### Manual

```bash
git pull origin main
npm install
npm run build
pm2 restart materialesya  # Si usas PM2
```

## 🐛 Solución de Problemas

### Error: "Module not found"

- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm install` nuevamente

### Error: "Environment variable not found"

- Verifica que las variables de entorno estén configuradas
- Reinicia el servidor después de agregar variables

### La aplicación no carga

- Verifica los logs: `pm2 logs` o `npm start`
- Revisa la consola del navegador
- Verifica que el puerto 3000 esté disponible

### Errores de autenticación

- Verifica las URLs de redirección en Supabase
- Asegúrate de que las variables de entorno sean correctas

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js Deployment](https://nextjs.org/docs/deployment)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

¿Necesitas ayuda? Abre un [issue](https://github.com/tu-usuario/MaterialesYA/issues) en GitHub.

