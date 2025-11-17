# 🔐 Solución de Problemas de Login

Esta guía te ayudará a resolver problemas comunes al intentar iniciar sesión.

## ❌ Problemas Comunes y Soluciones

### 1. **"Email o contraseña incorrectos"**

**Posibles causas:**
- Email o contraseña mal escritos
- Usuario no existe en Supabase
- Contraseña incorrecta

**Soluciones:**
1. Verifica que el email y contraseña sean correctos
2. Verifica que no haya espacios antes o después del email
3. Intenta restablecer tu contraseña desde "¿Olvidaste tu contraseña?"
4. Verifica en Supabase Dashboard > Authentication > Users que el usuario existe

---

### 2. **"Email not confirmed" / Usuario no confirmado**

**Causa:** El usuario no ha confirmado su email o la confirmación está desactivada pero el usuario está marcado como "Unconfirmed"

**Soluciones:**

**Opción A: Confirmar usuario manualmente**
1. Ve a Supabase Dashboard > Authentication > Users
2. Busca tu usuario por email
3. Haz clic en el usuario
4. Haz clic en **"Confirm User"** o marca **"Auto Confirm User"**
5. Intenta iniciar sesión nuevamente

**Opción B: Desactivar confirmación de email (solo desarrollo)**
1. Ve a Supabase Dashboard > Authentication > Settings
2. Busca "Email Auth"
3. Desactiva **"Enable email confirmations"**
4. Guarda los cambios

---

### 3. **"Supabase no está configurado"**

**Causa:** Las variables de entorno no están configuradas correctamente

**Soluciones:**
1. Verifica que existe el archivo `.env.local` en la raíz del proyecto
2. Verifica que contiene:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
   ```
3. Reinicia el servidor de desarrollo (`npm run dev`)
4. Verifica que las variables no tengan espacios extra o comillas

---

### 4. **"Error 400" o "Invalid API key"**

**Causa:** La clave de API de Supabase es incorrecta o inválida

**Soluciones:**
1. Ve a Supabase Dashboard > Settings > API
2. Copia la **URL** y la **anon/public key**
3. Actualiza tu archivo `.env.local` con los valores correctos
4. Reinicia el servidor de desarrollo

---

### 5. **Login exitoso pero no se actualiza el navbar**

**Causa:** El estado de autenticación no se está actualizando correctamente

**Soluciones:**
1. Espera unos segundos después del login
2. Recarga la página manualmente (F5)
3. Verifica en la consola del navegador si hay errores
4. Verifica que el evento `SIGNED_IN` se está disparando correctamente

---

### 6. **"User not found"**

**Causa:** El usuario no existe en Supabase

**Soluciones:**
1. Verifica que el email es correcto
2. Crea una nueva cuenta desde "Regístrate aquí"
3. Verifica en Supabase Dashboard > Authentication > Users que el usuario existe

---

## 🔍 Verificación Paso a Paso

### Paso 1: Verificar Variables de Entorno

Abre `.env.local` y verifica:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_aqui
```

### Paso 2: Verificar Usuario en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Users**
4. Busca tu usuario por email
5. Verifica que:
   - El usuario existe
   - El estado es **"Confirmed"** (no "Unconfirmed")
   - El email es correcto

### Paso 3: Verificar Configuración de Autenticación

1. Ve a **Authentication** > **Settings**
2. Verifica que:
   - **"Enable email confirmations"** está desactivado (para desarrollo) o activado con SMTP configurado
   - **"Site URL"** está configurado correctamente
   - **"Redirect URLs"** incluye `http://localhost:3000/**`

### Paso 4: Probar Login

1. Abre la consola del navegador (F12)
2. Intenta iniciar sesión
3. Revisa los mensajes en la consola
4. Si hay errores, cópialos y busca la solución arriba

---

## 🛠️ Debugging Avanzado

### Ver logs en la consola

El componente de login muestra logs en la consola:
- `"Intentando iniciar sesión con: [email]"` - Confirma que el login se está intentando
- `"Error de autenticación completo:"` - Muestra detalles del error

### Verificar sesión manualmente

Abre la consola del navegador y ejecuta:
```javascript
// Verificar si hay una sesión activa
const { data: { session } } = await supabase.auth.getSession();
console.log("Sesión actual:", session);

// Verificar usuario actual
const { data: { user } } = await supabase.auth.getUser();
console.log("Usuario actual:", user);
```

---

## 📞 ¿Aún tienes problemas?

1. Revisa los logs en la consola del navegador
2. Revisa los logs del servidor (terminal donde corre `npm run dev`)
3. Verifica que Supabase esté funcionando correctamente
4. Intenta crear un nuevo usuario y hacer login con ese usuario
5. Verifica que no haya problemas de red o firewall bloqueando las peticiones a Supabase

---

## ✅ Checklist de Verificación

- [ ] Variables de entorno configuradas correctamente
- [ ] Usuario existe en Supabase
- [ ] Usuario está confirmado ("Confirmed")
- [ ] Email y contraseña son correctos
- [ ] Servidor de desarrollo reiniciado después de cambiar variables
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la consola del servidor
- [ ] Supabase Dashboard muestra el usuario correctamente

