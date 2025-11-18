# Solución Rápida: Error "new row violates row-level security policy"

Si ves el error **"new row violates row-level security policy"** al intentar subir imágenes, sigue estos pasos:

## 🔧 Solución Rápida

### Paso 1: Ve al SQL Editor de Supabase

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Haz clic en **"New query"**

### Paso 2: Ejecuta estas políticas SQL

Copia y pega este código SQL completo y ejecútalo:

```sql
-- Eliminar políticas existentes si existen (opcional)
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;

-- Crear política para INSERT (subir archivos)
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Crear política para SELECT (leer archivos)
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Crear política para DELETE (eliminar archivos)
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### Paso 3: Verificar que el bucket existe y es público

1. Ve a **Storage** en el menú lateral
2. Verifica que existe un bucket llamado `images`
3. Si no existe, créalo:
   - Haz clic en **"New bucket"**
   - Nombre: `images`
   - **Marca la casilla "Public bucket"** (MUY IMPORTANTE)
   - Haz clic en **"Create bucket"**

### Paso 4: Verificar autenticación

Asegúrate de estar **logueado como administrador** en la aplicación antes de intentar subir imágenes.

### Paso 5: Probar de nuevo

1. Recarga la página del admin
2. Intenta subir una imagen nuevamente
3. Debería funcionar ahora

## 🐛 Si aún no funciona

### Verificar políticas existentes:

Ejecuta este query para ver qué políticas tienes:

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

### Crear políticas más permisivas (solo para desarrollo):

Si las políticas anteriores no funcionan, prueba estas más permisivas:

```sql
-- Política muy permisiva para desarrollo
CREATE POLICY "dev_allow_all_uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "dev_allow_all_reads"
ON storage.objects
FOR SELECT
TO public
USING (true);

CREATE POLICY "dev_allow_all_deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (true);
```

**⚠️ ADVERTENCIA:** Estas políticas son muy permisivas y solo deben usarse en desarrollo. En producción, usa las políticas más restrictivas del Paso 2.

## 📝 Verificar que funcionó

Después de ejecutar las políticas:

1. Ve a **Storage > Policies**
2. Selecciona el bucket `images`
3. Deberías ver las 3 políticas creadas:
   - Allow authenticated users to upload images
   - Allow public read access
   - Allow authenticated users to delete images

## ✅ Checklist Final

- [ ] Bucket `images` existe y es público
- [ ] Políticas RLS creadas correctamente
- [ ] Estás autenticado como administrador
- [ ] Recargaste la página después de crear las políticas

Si después de seguir estos pasos aún tienes problemas, verifica:
- Que las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén correctas
- Que estés usando la cuenta correcta de Supabase
- Los logs de la consola del navegador para más detalles del error

