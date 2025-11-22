# 🆘 Solución de Problemas

Guía consolidada para resolver problemas comunes.

## 📋 Tabla de Contenidos

1. [Problemas de Autenticación](#problemas-de-autenticación)
2. [Problemas de Supabase](#problemas-de-supabase)
3. [Problemas de Build/Deploy](#problemas-de-builddeploy)
4. [Problemas de UI](#problemas-de-ui)
5. [Problemas de Testing](#problemas-de-testing)

---

## 🔐 Problemas de Autenticación

### Login no funciona
Ver: [LOGIN_TROUBLESHOOTING.md](troubleshooting/LOGIN_TROUBLESHOOTING.md)

**Soluciones rápidas:**
- Verificar que las variables de entorno estén configuradas
- Verificar que el usuario exista en Supabase
- Verificar que el email esté confirmado (o deshabilitar confirmación)

### Usuario no puede iniciar sesión
- Verificar credenciales en Supabase Dashboard
- Verificar políticas RLS en Supabase
- Verificar logs del navegador (F12 → Console)

### Error de API Key
Ver: [FIX_API_KEY_ERROR.md](troubleshooting/FIX_API_KEY_ERROR.md)

---

## 🗄️ Problemas de Supabase

### Error de Storage/RLS
Ver: [FIX_STORAGE_RLS_ERROR.md](troubleshooting/FIX_STORAGE_RLS_ERROR.md)

### No se pueden cargar productos
- Verificar conexión a Supabase
- Verificar políticas RLS
- Verificar que las tablas existan
- Revisar logs en Supabase Dashboard

### Error de autenticación de Supabase
- Verificar `NEXT_PUBLIC_SUPABASE_URL`
- Verificar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verificar que las keys sean correctas en `.env.local`

---

## 🏗️ Problemas de Build/Deploy

### Build falla
- Ejecutar `npm run build` localmente para ver el error
- Verificar que todas las dependencias estén instaladas
- Verificar que no haya errores de TypeScript (`npx tsc --noEmit`)

### Deploy falla en Vercel
- Verificar variables de entorno en Vercel
- Verificar que el build funcione localmente
- Revisar logs de Vercel

### CI/CD falla en GitHub Actions
- Verificar que los secrets estén configurados
- Revisar logs del workflow en GitHub Actions
- Verificar que los tests pasen localmente

---

## 🎨 Problemas de UI

### Componentes no se ven bien
- Verificar que Tailwind esté configurado correctamente
- Limpiar caché: `rm -rf .next` y rebuild
- Verificar que los estilos se estén cargando

### Imágenes no cargan
- Verificar configuración de Supabase Storage
- Verificar políticas RLS de Storage
- Verificar URLs de las imágenes

### Modo oscuro no funciona
- Verificar que el theme provider esté configurado
- Limpiar localStorage del navegador
- Verificar que el componente esté usando el hook correcto

---

## 🧪 Problemas de Testing

### Tests fallan
- Ejecutar `npm run test:unit` localmente
- Verificar que las dependencias de testing estén instaladas
- Revisar mensajes de error específicos

### Tests E2E fallan
- Verificar que la aplicación esté corriendo (`npm run dev`)
- Verificar que Playwright esté instalado (`npx playwright install`)
- Revisar screenshots en `test-results/`

---

## 🔍 Búsqueda de Errores Comunes

| Error | Solución |
|-------|----------|
| "Invalid API key" | Verificar variables de entorno |
| "RLS policy violation" | Verificar políticas en Supabase |
| "Module not found" | Ejecutar `npm install` |
| "Build failed" | Verificar errores de TypeScript |
| "Tests timeout" | Aumentar timeout o verificar conexión |

---

## 📚 Recursos Adicionales

- **Documentación de Supabase**: https://supabase.com/docs
- **Documentación de Next.js**: https://nextjs.org/docs
- **Documentación de Vercel**: https://vercel.com/docs

---

## 💡 Tips Generales

1. **Siempre verifica los logs** del navegador (F12 → Console)
2. **Verifica las variables de entorno** en `.env.local`
3. **Limpia el caché** si algo no funciona: `rm -rf .next`
4. **Reinstala dependencias** si hay problemas: `rm -rf node_modules && npm install`
5. **Revisa la documentación** específica del problema

---

## 🆘 ¿No encuentras la solución?

1. Revisa los logs específicos del error
2. Busca en la documentación del proyecto
3. Verifica la configuración paso a paso
4. Consulta la documentación oficial de las herramientas usadas
