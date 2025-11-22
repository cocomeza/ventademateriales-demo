# Guía de Configuración de Supabase - MaterialesYA

Esta guía te ayudará a configurar completamente tu base de datos en Supabase paso a paso.

## 📋 Requisitos Previos

- Cuenta de Supabase creada ([supabase.com](https://supabase.com))
- Proyecto de Supabase creado
- Acceso al SQL Editor de Supabase

## 🚀 Pasos para Configurar la Base de Datos

### Paso 1: Acceder al SQL Editor

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **New Query** para crear una nueva consulta

### Paso 2: Ejecutar el Script Principal

1. Abre el archivo `supabase/setup-complete.sql` en tu editor
2. Copia **todo el contenido** del archivo
3. Pégalo en el SQL Editor de Supabase
4. Haz clic en **Run** o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

**⏱️ Tiempo estimado:** 1-2 minutos

### Paso 3: Verificar la Creación de Tablas

Ejecuta esta consulta para verificar que todas las tablas se crearon:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver estas tablas:
- categories
- customer_prices
- customers
- discounts
- inventory_movements
- order_status_history
- orders
- product_images
- product_variants
- products
- stock_alerts
- user_roles
- wishlists

### Paso 4: (Opcional) Insertar Datos de Ejemplo

Si quieres datos de prueba:

1. Abre el archivo `supabase/seed-data.sql`
2. Copia todo el contenido
3. Pégalo en el SQL Editor
4. Ejecuta el script

**Nota:** Esto insertará categorías y productos de ejemplo.

### Paso 5: Configurar Autenticación

1. Ve a **Authentication** > **URL Configuration** en Supabase Dashboard
2. Agrega estas URLs de redirección:

**Para desarrollo:**
```
http://localhost:3000/auth/callback
```

**Para producción:**
```
https://tu-dominio.com/auth/callback
https://tu-proyecto.vercel.app/auth/callback
```

### Paso 6: Crear tu Primer Usuario Admin

Para crear un usuario administrador, consulta la guía completa:

**📖 Guía detallada:** [ADMIN_SETUP.md](./ADMIN_SETUP.md)

**Resumen rápido:**

1. Ve a **Authentication** > **Users** en Supabase Dashboard
2. Crea un nuevo usuario con email y contraseña
3. Copia el **User ID** (UUID) del usuario creado
4. Ejecuta este SQL en el SQL Editor (reemplaza `USER_ID_AQUI` con el UUID):

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('USER_ID_AQUI', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

5. Inicia sesión en la aplicación con ese email y contraseña
6. Accede a `/admin` para ver el panel de administración

## 🔍 Verificación

### Verificar Políticas RLS

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verificar Triggers

```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

### Verificar Índices

```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## 🐛 Solución de Problemas

### Error: "relation already exists"

Si alguna tabla ya existe, el script usa `CREATE TABLE IF NOT EXISTS`, así que debería funcionar. Si persiste el error:

1. Elimina las tablas manualmente desde el Table Editor
2. O ejecuta `DROP TABLE IF EXISTS nombre_tabla CASCADE;` antes del script

### Error: "policy already exists"

El script usa `DROP POLICY IF EXISTS` antes de crear políticas, pero si aún hay problemas:

1. Elimina las políticas manualmente desde el SQL Editor
2. O ejecuta el script completo nuevamente

### Error de permisos

Asegúrate de estar ejecutando el script como el usuario correcto. En Supabase, normalmente eres el owner del proyecto.

### Las políticas RLS bloquean todo

Si las políticas RLS están bloqueando el acceso:

1. Verifica que el usuario esté autenticado
2. Revisa las políticas en el SQL Editor
3. Temporalmente puedes deshabilitar RLS: `ALTER TABLE nombre_tabla DISABLE ROW LEVEL SECURITY;` (solo para desarrollo)

## 📝 Estructura de la Base de Datos

### Tablas Principales

- **products**: Productos del catálogo
- **categories**: Categorías de productos
- **customers**: Clientes
- **orders**: Pedidos/órdenes
- **user_roles**: Roles de usuarios (admin, seller, customer)

### Tablas Relacionadas

- **product_images**: Imágenes de productos
- **product_variants**: Variantes de productos (tamaño, color, etc.)
- **discounts**: Descuentos y promociones
- **customer_prices**: Precios personalizados por cliente
- **wishlists**: Favoritos de usuarios
- **order_status_history**: Historial de cambios de estado de órdenes
- **inventory_movements**: Movimientos de inventario
- **stock_alerts**: Alertas de stock bajo

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas que:

- **Productos**: Lectura pública, escritura solo para autenticados
- **Órdenes**: Usuarios solo ven sus propias órdenes
- **Clientes**: Solo usuarios autenticados pueden ver/gestionar
- **Roles**: Usuarios ven su propio rol, admins gestionan todos

### Roles de Usuario

- **admin**: Acceso completo al sistema
- **seller**: Puede gestionar productos y categorías
- **customer**: Usuario regular (por defecto)

## 📚 Próximos Pasos

1. Configura las variables de entorno en tu proyecto local (`.env.local`)
2. Prueba la conexión ejecutando `npm run dev`
3. Crea algunos productos desde el panel de administración
4. Prueba el flujo completo de compra

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Supabase Dashboard > Logs
2. Verifica la consola del navegador (F12)
3. Consulta la [documentación de Supabase](https://supabase.com/docs)
4. Abre un [issue en GitHub](https://github.com/tu-usuario/MaterialesYA/issues)

---

¡Listo! Tu base de datos está configurada y lista para usar. 🎉

