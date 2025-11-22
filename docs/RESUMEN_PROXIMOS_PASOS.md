# 🚀 Resumen: Próximos Pasos para Configurar CI/CD

## ✅ Estado Actual

Tu proyecto ya tiene:
- ✅ Framer Motion instalado y configurado
- ✅ Tests unitarios de stock funcionando (34 tests pasando)
- ✅ Workflows de GitHub Actions creados
- ✅ Documentación completa

## 📋 Checklist de Configuración

### Paso 1: Configurar Secrets en GitHub (15 minutos)

1. **Ve a tu repositorio en GitHub** → Settings → Secrets and variables → Actions

2. **Agrega estos secrets** (uno por uno):

   ```
   VERCEL_TOKEN              → Token de Vercel (crear en vercel.com/dashboard)
   VERCEL_ORG_ID             → ID de tu organización en Vercel
   VERCEL_PROJECT_ID         → ID de tu proyecto en Vercel
   NEXT_PUBLIC_SUPABASE_URL  → URL de tu proyecto Supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY → Clave anónima de Supabase
   ```

3. **Opcional (para staging):**
   ```
   NEXT_PUBLIC_SUPABASE_URL_STAGING
   NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING
   ```

4. **Opcional (para Sentry):**
   ```
   SENTRY_ORG
   SENTRY_PROJECT
   SENTRY_AUTH_TOKEN
   ```

📖 **Guía detallada:** Ver `docs/GUIA_CONFIGURACION.md`

### Paso 2: Verificar Localmente (5 minutos)

Ejecuta estos comandos para asegurarte de que todo funciona:

```bash
# 1. Verificar configuración
npm run check:setup

# 2. Verificar lint
npm run lint

# 3. Ejecutar tests unitarios
npm run test:unit

# 4. Verificar que compila
npm run build
```

Si todos pasan ✅, estás listo para el siguiente paso.

### Paso 3: Probar en GitHub (10 minutos)

#### Opción A: Probar CI (Recomendado primero)

1. Haz un pequeño cambio (ej: agregar un comentario)
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "test: probar CI workflow"
   git push origin main
   ```
3. Ve a GitHub → **Actions**
4. Deberías ver el workflow "CI" ejecutándose
5. Espera a que termine (5-10 minutos)

#### Opción B: Probar Deploy a Staging

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

3. Ve a **Actions** → Deberías ver "Deploy to Staging"

#### Opción C: Probar Deploy a Producción

⚠️ **Solo hazlo cuando estés seguro de que todo funciona**

```bash
git checkout main
git merge develop
git push origin main
```

## 🎯 Resultado Esperado

Después de completar estos pasos:

1. ✅ Cada push activará automáticamente los workflows
2. ✅ Los tests se ejecutarán antes de cada despliegue
3. ✅ Los despliegues serán automáticos a staging/producción
4. ✅ Tendrás monitoreo de errores con Sentry

## 📚 Documentación Disponible

- `docs/GUIA_CONFIGURACION.md` - Guía paso a paso detallada
- `docs/CI_CD_SETUP.md` - Documentación técnica de los workflows
- `scripts/check-setup.js` - Script de verificación automática

## 🆘 Si Algo Sale Mal

### Los workflows fallan en GitHub pero funcionan localmente
- Verifica que todos los secrets estén configurados correctamente
- Revisa los logs del workflow en GitHub Actions
- Asegúrate de que los nombres de los secrets sean exactos (case-sensitive)

### No puedo encontrar los IDs de Vercel
```bash
# Instala Vercel CLI
npm i -g vercel

# Inicia sesión
vercel login

# Vincula tu proyecto (mostrará los IDs)
vercel link
```

### Los tests fallan
- Ejecuta `npm run test:unit` localmente primero
- Revisa los logs del workflow para ver el error específico
- Verifica que las variables de entorno estén configuradas

## ✨ Comandos Útiles

```bash
# Verificar todo antes de hacer push
npm run check:all

# Solo verificar configuración
npm run check:setup

# Ejecutar todos los tests
npm run test:all

# Ver workflows de GitHub (requiere GitHub CLI)
gh run list
gh run watch
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tu proyecto tendrá CI/CD completamente funcional. Cada vez que hagas push, los workflows se ejecutarán automáticamente.

**¿Necesitas ayuda?** Revisa la documentación en `docs/` o los logs de los workflows en GitHub Actions.

