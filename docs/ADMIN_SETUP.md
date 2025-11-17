# Guía para Configurar Usuario Admin - MaterialesYA

Esta guía te ayudará a crear y configurar un usuario administrador para acceder al panel de administración.

## 📋 Pasos para Crear un Usuario Admin

### Paso 1: Crear Usuario en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. **(Recomendado)** Desactiva la confirmación de email:
   - Ve a **Authentication** > **Settings**
   - Desactiva **"Enable email confirmations"**
   - Haz clic en **Save**
   - Esto permite que todos los usuarios inicien sesión sin confirmar email
3. En el menú lateral, ve a **Authentication** > **Users**
4. Haz clic en **Add User** > **Create New User**
5. Completa el formulario:
   - **Email**: Ingresa el email que usarás para iniciar sesión (ej: `admin@materialesya.com`)
   - **Password**: Crea una contraseña segura
   - **Auto Confirm User**: ✅ Marca esta casilla (importante si no desactivaste la confirmación)
6. Haz clic en **Create User**
7. **IMPORTANTE**: Copia el **User ID** (UUID) que aparece después de crear el usuario

### Paso 2: Asignar Rol de Admin

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta este SQL (reemplaza `USER_ID_AQUI` con el UUID que copiaste):

```sql
-- Insertar rol de admin para el usuario
INSERT INTO user_roles (user_id, role) 
VALUES ('USER_ID_AQUI', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

**Ejemplo:**
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Paso 3: Verificar que el Rol se Asignó Correctamente

Ejecuta este SQL para verificar:

```sql
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

Deberías ver tu email con el rol "admin".

## 🚀 Iniciar Sesión como Admin

### Opción 1: Desde la Aplicación Web

1. Ve a `http://localhost:3000/auth/login` (o tu URL de producción)
2. Ingresa el **email** y **contraseña** que creaste
3. Haz clic en **Iniciar Sesión**
4. Después de iniciar sesión, ve a `http://localhost:3000/admin`

### Opción 2: Acceso Directo al Panel Admin

1. Inicia sesión normalmente en `/auth/login`
2. Una vez autenticado, navega a `/admin`
3. Si tienes rol de admin, verás el panel de administración

## 🔐 Roles Disponibles

El sistema tiene 3 roles:

- **admin**: Acceso completo al sistema
- **seller**: Puede gestionar productos y categorías
- **customer**: Usuario regular (por defecto)

## 🛠️ Crear Múltiples Admins

Para crear más usuarios admin, repite los pasos 1 y 2 con diferentes emails.

**Script rápido para crear múltiples admins:**

```sql
-- Reemplaza los USER_IDs con los UUIDs reales de tus usuarios
INSERT INTO user_roles (user_id, role) VALUES
  ('USER_ID_1', 'admin'),
  ('USER_ID_2', 'admin'),
  ('USER_ID_3', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## 🔍 Verificar Usuarios y Roles

Para ver todos los usuarios y sus roles:

```sql
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
```

## 🐛 Solución de Problemas

### Error: "No tienes permisos para acceder"

**Causa:** El usuario no tiene rol de admin asignado.

**Solución:**
1. Verifica que ejecutaste el SQL para asignar el rol
2. Verifica que el User ID es correcto
3. Cierra sesión y vuelve a iniciar sesión

### Error: "Usuario no encontrado"

**Causa:** El usuario no existe en Supabase Auth.

**Solución:**
1. Verifica que creaste el usuario en Authentication > Users
2. Verifica que el email es correcto
3. Asegúrate de que el usuario está confirmado

### No puedo acceder a /admin

**Causa:** El usuario no tiene rol de admin o seller.

**Solución:**
1. Verifica tu rol ejecutando:
```sql
SELECT role FROM user_roles WHERE user_id = 'TU_USER_ID';
```
2. Si no aparece, asigna el rol siguiendo el Paso 2
3. Si aparece pero es "customer", actualízalo:
```sql
UPDATE user_roles SET role = 'admin' WHERE user_id = 'TU_USER_ID';
```

### El usuario tiene rol pero sigue sin acceso

**Solución:**
1. Cierra sesión completamente
2. Limpia las cookies del navegador
3. Vuelve a iniciar sesión
4. Intenta acceder a `/admin` nuevamente

## 📝 Cambiar Rol de un Usuario

Para cambiar el rol de un usuario existente:

```sql
-- Cambiar a admin
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_AQUI';

-- Cambiar a seller
UPDATE user_roles 
SET role = 'seller' 
WHERE user_id = 'USER_ID_AQUI';

-- Cambiar a customer
UPDATE user_roles 
SET role = 'customer' 
WHERE user_id = 'USER_ID_AQUI';
```

## 🔒 Seguridad

- **Nunca compartas** las credenciales de admin
- Usa contraseñas seguras (mínimo 12 caracteres, con mayúsculas, números y símbolos)
- Considera usar autenticación de dos factores (2FA) si está disponible
- Revisa periódicamente los usuarios con rol de admin

## 📚 Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guía de Configuración de Supabase](./SUPABASE_SETUP.md)
- [Guía de Instalación](./INSTALLATION.md)

---

¿Necesitas ayuda? Abre un [issue](https://github.com/cocomeza/materialesya-demo/issues) en GitHub.

