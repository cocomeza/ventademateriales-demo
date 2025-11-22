# ✅ Confirmar Usuario Rápido en Supabase

Si acabas de registrarte y ves el error **"Por favor confirma tu email antes de iniciar sesión"**, sigue estos pasos:

## 🚀 Solución Rápida (2 minutos)

### Paso 1: Ir a Supabase Dashboard
1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto

### Paso 2: Encontrar tu Usuario
1. En el menú lateral, haz clic en **Authentication**
2. Haz clic en **Users**
3. Busca tu email (`moniargento@gmail.com` o el que usaste)
4. Verás que el estado dice **"Unconfirmed"** (no confirmado)

### Paso 3: Confirmar el Usuario
1. Haz clic en tu usuario (en la fila de la tabla)
2. Se abrirá un panel lateral con los detalles del usuario
3. Busca el botón **"Confirm User"** o la casilla **"Auto Confirm User"**
4. Haz clic en **"Confirm User"** o marca **"Auto Confirm User"**
5. El estado cambiará a **"Confirmed"** ✅

### Paso 4: Intentar Login Nuevamente
1. Vuelve a tu aplicación
2. Intenta hacer login con tu email y contraseña
3. ¡Deberías poder iniciar sesión! 🎉

---

## 🔧 Alternativa: Desactivar Confirmación de Email (Solo Desarrollo)

Si estás en desarrollo y quieres que los usuarios se confirmen automáticamente:

1. Ve a **Authentication** > **Settings**
2. Busca la sección **Email Auth**
3. **Desactiva** la opción **"Enable email confirmations"**
4. Haz clic en **Save**

**⚠️ Nota:** Esto es solo para desarrollo. En producción, mantén la confirmación activa para mayor seguridad.

---

## 📸 Guía Visual

1. **Authentication** > **Users** → Verás la lista de usuarios
2. Haz clic en tu usuario → Se abre el panel de detalles
3. Busca **"Confirm User"** o **"Auto Confirm User"** → Haz clic
4. El estado cambia a **"Confirmed"** → Listo para hacer login

---

## ❓ ¿No encuentras el botón?

Si no ves el botón "Confirm User":
- Asegúrate de estar en la vista de detalles del usuario (haz clic en la fila)
- Busca en el panel lateral que se abre a la derecha
- Puede estar en la parte superior del panel o en una pestaña

---

**Tiempo estimado:** 2 minutos ⏱️

