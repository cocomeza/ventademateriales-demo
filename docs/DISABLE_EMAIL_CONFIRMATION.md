# Desactivar Confirmación de Email en Supabase

Esta guía te ayudará a desactivar la verificación de email para que los usuarios puedan iniciar sesión inmediatamente después de registrarse.

## 🔧 Pasos para Desactivar la Confirmación de Email

### Opción 1: Desde el Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, ve a **Authentication** > **Settings**
3. Busca la sección **Email Auth**
4. **Desactiva** la opción **"Enable email confirmations"**
5. Haz clic en **Save**

### Opción 2: Confirmar Usuarios Existentes Manualmente

Si ya tienes usuarios creados que están esperando confirmación:

1. Ve a **Authentication** > **Users**
2. Para cada usuario que quieras confirmar:
   - Haz clic en el usuario
   - Haz clic en el botón **"Confirm User"** o marca **"Auto Confirm User"**

### Opción 3: Auto-confirmar al Crear Usuarios

Cuando crees nuevos usuarios desde el Dashboard:

1. Ve a **Authentication** > **Users**
2. Haz clic en **Add User** > **Create New User**
3. Completa el formulario
4. **Marca la casilla "Auto Confirm User"** antes de crear
5. Haz clic en **Create User**

## 📝 Nota Importante

**Seguridad:**
- Desactivar la confirmación de email reduce la seguridad
- Solo hazlo en desarrollo o aplicaciones internas
- En producción, considera mantener la confirmación activa

**Alternativa para Producción:**
- Mantén la confirmación activa
- Configura un servicio de email SMTP en Supabase
- O usa un servicio como SendGrid, Mailgun, etc.

## ✅ Verificación

Después de desactivar la confirmación:

1. Crea un nuevo usuario o usa uno existente
2. Intenta iniciar sesión inmediatamente
3. Deberías poder iniciar sesión sin confirmar el email

---

¿Necesitas ayuda? Consulta la [guía de solución de problemas](./TROUBLESHOOTING.md).

