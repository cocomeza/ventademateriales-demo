# 🔧 Solucionar Error "Invalid API key" (401)

Si estás viendo el error **"Invalid API key"** o **Error 401**, significa que la clave de API de Supabase no está configurada correctamente.

## 🚨 Síntomas

- Error 401 en todas las peticiones a Supabase
- Mensaje "Invalid API key" en la consola
- No puedes hacer login
- No se cargan los productos

## ✅ Solución Paso a Paso

### Paso 1: Obtener las Claves Correctas de Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** (⚙️) > **API**
4. Encontrarás:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)

### Paso 2: Actualizar el Archivo .env.local

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Actualiza o agrega estas líneas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:**
- No uses comillas alrededor de los valores
- No dejes espacios antes o después del `=`
- Usa la clave **anon public**, NO la clave **service_role** (es secreta)
- Copia exactamente como aparece en Supabase Dashboard

### Paso 3: Verificar el Formato

Tu archivo `.env.local` debería verse así:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xttmheeocptzkqayjyig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dG1oZWVvY3B0emtxYXlqeWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Paso 4: Reiniciar el Servidor

**CRÍTICO:** Después de cambiar `.env.local`, DEBES reiniciar el servidor:

1. Detén el servidor (Ctrl+C en la terminal)
2. Inicia nuevamente:
   ```bash
   npm run dev
   ```

**⚠️ Si no reinicias el servidor, los cambios no se aplicarán.**

### Paso 5: Verificar que Funciona

1. Abre la consola del navegador (F12)
2. Intenta hacer login o cargar productos
3. No deberías ver más errores 401
4. Si aún ves errores, verifica:
   - Que copiaste la clave completa (son muy largas)
   - Que no hay espacios extra
   - Que reiniciaste el servidor

## 🔍 Verificación Adicional

### Verificar que las Variables Están Cargadas

Abre la consola del navegador y ejecuta:

```javascript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

Si ves `undefined`, significa que las variables no se están cargando correctamente.

### Verificar el Archivo .env.local

1. Asegúrate de que el archivo se llama exactamente `.env.local` (con el punto al inicio)
2. Asegúrate de que está en la raíz del proyecto (mismo nivel que `package.json`)
3. Verifica que no hay errores de sintaxis

## ❌ Errores Comunes

### Error: "Cannot find module '.env.local'"
- El archivo no existe, créalo en la raíz del proyecto

### Error: Variables siguen siendo undefined después de reiniciar
- Verifica que el archivo se llama `.env.local` (no `.env.local.txt` o similar)
- Verifica que está en la raíz del proyecto
- Reinicia el servidor completamente

### Error: "Invalid API key" persiste
- Verifica que copiaste la clave completa (son muy largas, ~200 caracteres)
- Verifica que usaste la clave **anon public**, no la **service_role**
- Verifica que no hay espacios o caracteres extra
- Intenta copiar y pegar nuevamente desde Supabase Dashboard

## 📞 ¿Aún Tienes Problemas?

1. Verifica que tu proyecto de Supabase está activo
2. Verifica que las claves no han expirado (raro, pero puede pasar)
3. Intenta generar nuevas claves en Supabase Dashboard > Settings > API > Reset API keys
4. Verifica que no hay problemas de red o firewall

---

**Nota:** Si estás usando Git, asegúrate de que `.env.local` está en `.gitignore` para no subir tus claves al repositorio.

