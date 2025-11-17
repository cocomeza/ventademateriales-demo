# Guía de Solución de Problemas - MaterialesYA

Esta guía te ayudará a resolver problemas comunes que pueden surgir al usar MaterialesYA.

## 🔐 Problemas de Autenticación

### Error 400 al iniciar sesión

**Síntomas:**
- Error 400 en `/auth/v1/token?grant_type=password`
- No puedes iniciar sesión

**Soluciones:**

1. **Verifica que el usuario existe:**
   - Ve a Supabase Dashboard > Authentication > Users
   - Verifica que el usuario existe con el email correcto

2. **Verifica que el usuario está confirmado:**
   - En Supabase Dashboard > Authentication > Users
   - Busca tu usuario
   - Si dice "Unconfirmed", haz clic en el usuario y marca "Auto Confirm User" o confírmalo manualmente

3. **Verifica la contraseña:**
   - Asegúrate de que la contraseña es correcta
   - Prueba restablecer la contraseña desde Supabase Dashboard

4. **Crea un nuevo usuario admin:**
   ```sql
   -- En Supabase SQL Editor, ejecuta:
   -- Primero crea el usuario en Authentication > Users
   -- Luego asigna el rol:
   INSERT INTO user_roles (user_id, role) 
   VALUES ('TU_USER_ID', 'admin')
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```

### Usuario no puede iniciar sesión después de registrarse

**Solución:**
1. Ve a Supabase Dashboard > Authentication > Settings
2. Desactiva "Enable email confirmations" temporalmente para desarrollo
3. O confirma el usuario manualmente desde Authentication > Users

### Error: "Email not confirmed"

**Solución:**
1. Ve a Supabase Dashboard > Authentication > Users
2. Busca tu usuario
3. Haz clic en "Confirm User" o marca "Auto Confirm User"

## 🗄️ Problemas de Base de Datos

### Error 500 al cargar categorías/productos

**Causas posibles:**
1. Las tablas no existen
2. Las políticas RLS están bloqueando el acceso
3. Error de recursión infinita en políticas

**Soluciones:**

1. **Verifica que las tablas existen:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Ejecuta el script de corrección de políticas:**
   - Ejecuta `supabase/fix-rls-policies.sql` en Supabase SQL Editor

3. **Verifica las políticas RLS:**
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

### Error: "infinite recursion detected in policy"

**Solución:**
Ejecuta el script `supabase/fix-rls-policies.sql` que corrige las políticas problemáticas.

## 🔧 Problemas de Configuración

### Error: "Supabase no está configurado"

**Solución:**
1. Verifica que existe el archivo `.env.local`
2. Verifica que las variables están correctas:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
   ```
3. Reinicia el servidor de desarrollo después de cambiar `.env.local`

### Variables de entorno no se cargan

**Solución:**
1. Asegúrate de que el archivo se llama `.env.local` (no `.env`)
2. Reinicia el servidor completamente
3. Verifica que no hay espacios extra en las variables

## 🚀 Problemas de Build/Deploy

### Error al hacer build

**Soluciones:**

1. **Limpia la caché:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Verifica errores de TypeScript:**
   ```bash
   npm run lint
   ```

3. **Reinstala dependencias:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Error en Vercel: "Module not found"

**Solución:**
1. Verifica que todas las dependencias están en `package.json`
2. Asegúrate de que `node_modules` está en `.gitignore`
3. Verifica que el build command es correcto en Vercel

## 🐛 Problemas Comunes

### Los productos no se muestran

**Verificaciones:**
1. ¿Ejecutaste `supabase/setup-complete.sql`?
2. ¿Hay productos en la tabla `products`?
3. ¿Las políticas RLS permiten lectura pública?
4. Revisa la consola del navegador (F12) para errores

### El carrito no persiste

**Solución:**
- El carrito usa localStorage del navegador
- Verifica que las cookies/localStorage no están bloqueadas
- Prueba en modo incógnito para descartar extensiones

### No puedo acceder a /admin

**Verificaciones:**
1. ¿Tienes rol de admin asignado?
   ```sql
   SELECT role FROM user_roles WHERE user_id = 'TU_USER_ID';
   ```
2. ¿Cerraste sesión y volviste a iniciar sesión?
3. ¿Las cookies están habilitadas?

### Las imágenes no se cargan

**Solución:**
1. Verifica que las URLs de las imágenes son correctas
2. Si usas Supabase Storage, verifica las políticas de acceso
3. Verifica que `next.config.js` tiene configurado el dominio de Supabase

## 📝 Logs y Debugging

### Ver logs en desarrollo

```bash
# Los logs aparecen en la consola del servidor
npm run dev
```

### Ver logs en Supabase

1. Ve a Supabase Dashboard > Logs
2. Selecciona "API" o "Auth" según el problema
3. Revisa los errores recientes

### Ver logs en el navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Revisa los errores en rojo

## 🔍 Verificaciones Rápidas

### Checklist de Diagnóstico

- [ ] Variables de entorno configuradas correctamente
- [ ] Scripts SQL ejecutados en Supabase
- [ ] Usuario creado y confirmado en Supabase
- [ ] Rol de admin asignado al usuario
- [ ] Políticas RLS configuradas correctamente
- [ ] Servidor de desarrollo reiniciado después de cambios
- [ ] Navegador actualizado (Ctrl+F5)

## 🆘 Obtener Ayuda

Si el problema persiste:

1. **Revisa los logs:**
   - Consola del navegador (F12)
   - Logs del servidor
   - Logs de Supabase Dashboard

2. **Verifica la documentación:**
   - [Guía de Instalación](./INSTALLATION.md)
   - [Configuración de Supabase](./SUPABASE_SETUP.md)
   - [Configuración de Admin](./ADMIN_SETUP.md)

3. **Abre un issue en GitHub:**
   - Incluye el mensaje de error completo
   - Describe los pasos para reproducir
   - Incluye información del entorno (OS, navegador, versión de Node)

---

¿Necesitas más ayuda? Consulta la [documentación completa](./README.md) o abre un [issue](https://github.com/cocomeza/materialesya-demo/issues).

