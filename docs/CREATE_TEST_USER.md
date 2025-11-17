# 👤 Crear Usuario de Prueba en Supabase

Si estás viendo el error **"Invalid login credentials"**, significa que el usuario no existe o las credenciales son incorrectas.

## 🔍 Verificar si el Usuario Existe

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Users**
4. Busca el usuario `pepeargento@gmail.com`

## ✅ Opción 1: Crear Usuario desde el Dashboard

Si el usuario **NO existe**, créalo manualmente:

1. En **Authentication** > **Users**, haz clic en **Add User** > **Create New User**
2. Completa el formulario:
   - **Email**: `pepeargento@gmail.com`
   - **Password**: (elige una contraseña segura)
   - **Auto Confirm User**: ✅ **Marca esta casilla** (importante)
3. Haz clic en **Create User**

## ✅ Opción 2: Registrar Usuario desde la App

Si prefieres crear el usuario desde la aplicación:

1. Ve a `/auth/register` en tu aplicación
2. Completa el formulario de registro con:
   - Email: `pepeargento@gmail.com`
   - Contraseña: (elige una contraseña)
3. Después de registrarte, ve a Supabase Dashboard > Authentication > Users
4. Busca tu usuario y haz clic en **"Confirm User"** o marca **"Auto Confirm User"**
5. Ahora puedes hacer login

## ✅ Opción 3: Restablecer Contraseña

Si el usuario **SÍ existe** pero olvidaste la contraseña:

1. Ve a `/auth/reset-password` en tu aplicación
2. Ingresa tu email: `pepeargento@gmail.com`
3. Revisa tu email (o la carpeta de spam) para el link de restablecimiento
4. Si no recibes el email, ve a Supabase Dashboard > Authentication > Users
5. Haz clic en tu usuario y selecciona **"Reset Password"**

## ✅ Opción 4: Cambiar Contraseña desde Dashboard

Si tienes acceso al Dashboard y quieres cambiar la contraseña manualmente:

1. Ve a **Authentication** > **Users**
2. Busca `pepeargento@gmail.com`
3. Haz clic en el usuario
4. Haz clic en **"Reset Password"** o edita la contraseña directamente
5. Guarda los cambios

## 🔐 Verificar Usuario Confirmado

**IMPORTANTE:** Asegúrate de que el usuario esté **confirmado**:

1. Ve a **Authentication** > **Users**
2. Busca tu usuario
3. Verifica que el estado sea **"Confirmed"** (no "Unconfirmed")
4. Si está "Unconfirmed", haz clic en el usuario y marca **"Auto Confirm User"**

## 🧪 Probar Login

Después de crear/confirmar el usuario:

1. Ve a `/auth/login` en tu aplicación
2. Ingresa:
   - Email: `pepeargento@gmail.com`
   - Contraseña: (la que configuraste)
3. Haz clic en "Iniciar Sesión"
4. Deberías poder iniciar sesión correctamente

## 📝 Notas Importantes

- **Auto Confirm User**: Siempre marca esta opción al crear usuarios manualmente para evitar problemas de confirmación
- **Contraseña**: Debe tener al menos 6 caracteres
- **Email**: Debe ser un formato válido de email

---

¿Necesitas ayuda? Consulta la [guía de solución de problemas de login](./LOGIN_TROUBLESHOOTING.md).

