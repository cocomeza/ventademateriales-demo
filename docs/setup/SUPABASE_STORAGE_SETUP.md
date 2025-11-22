# Configuración de Supabase Storage para Imágenes

Este documento explica cómo configurar Supabase Storage para permitir la carga de imágenes en el CRUD de productos y categorías.

## 📋 Requisitos Previos

1. Tener un proyecto de Supabase creado
2. Tener acceso al Dashboard de Supabase
3. Tener configuradas las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🚀 Pasos para Configurar Storage

### 1. Crear el Bucket de Storage

1. **Ve a tu Dashboard de Supabase:**
   - Inicia sesión en [supabase.com](https://supabase.com)
   - Selecciona tu proyecto

2. **Navega a Storage:**
   - En el menú lateral, haz clic en "Storage"

3. **Crea un nuevo bucket:**
   - Haz clic en "New bucket"
   - Nombre del bucket: `images`
   - Marca la opción **"Public bucket"** (esto permite acceso público a las imágenes)
   - Haz clic en "Create bucket"

### 2. Configurar Políticas de Seguridad (RLS)

Para permitir que los usuarios autenticados puedan subir imágenes:

1. **Ve a Storage > Policies:**
   - Selecciona el bucket `images`
   - Haz clic en "New Policy"

2. **Crea una política para INSERT (subir archivos):**
   - Nombre: `Allow authenticated users to upload images`
   - Operación: `INSERT`
   - Política: Usa el siguiente SQL:

```sql
-- Permitir a usuarios autenticados subir imágenes
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] IN ('products', 'categories')
);
```

3. **Crea una política para SELECT (leer archivos):**
   - Nombre: `Allow public read access`
   - Operación: `SELECT`
   - Política: Usa el siguiente SQL:

```sql
-- Permitir acceso público de lectura
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');
```

4. **Crea una política para DELETE (eliminar archivos):**
   - Nombre: `Allow authenticated users to delete images`
   - Operación: `DELETE`
   - Política: Usa el siguiente SQL:

```sql
-- Permitir a usuarios autenticados eliminar imágenes
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### 3. Verificar la Configuración

Una vez configurado, deberías poder:

1. **Subir imágenes desde el CRUD:**
   - Ve a `/admin/products` o `/admin/categories`
   - Crea o edita un producto/categoría
   - Haz clic en el botón de upload (📤) junto al campo de URL
   - Selecciona una imagen desde tu computadora
   - La imagen se subirá automáticamente y la URL se completará

2. **Ver las imágenes subidas:**
   - Ve a Storage > `images` bucket
   - Deberías ver las carpetas `products/` y `categories/`
   - Las imágenes subidas aparecerán allí

## 🔧 Solución de Problemas

### Error: "Bucket not found"

**Solución:** Asegúrate de que el bucket `images` existe y está marcado como público.

### Error: "new row violates row-level security policy"

**Solución:** Verifica que las políticas RLS están configuradas correctamente. Asegúrate de estar autenticado como administrador.

### Las imágenes no se muestran después de subir

**Solución:** 
1. Verifica que el bucket está marcado como público
2. Verifica que la política de SELECT permite acceso público
3. Revisa la consola del navegador para ver errores específicos

### Error: "File size too large"

**Solución:** El límite por defecto es 5MB. Si necesitas subir archivos más grandes, puedes modificar el límite en `lib/supabase/storage.ts`:

```typescript
const maxSize = 10 * 1024 * 1024; // 10MB
```

## 📝 Notas Importantes

- **Límite de tamaño:** Por defecto, las imágenes están limitadas a 5MB
- **Formatos soportados:** Cualquier formato de imagen (jpg, png, gif, webp, etc.)
- **Organización:** Las imágenes se organizan en carpetas:
  - `products/` - Imágenes de productos
  - `categories/` - Imágenes de categorías
- **URLs públicas:** Las imágenes subidas generan URLs públicas que se pueden usar directamente

## 🎯 Uso en la Aplicación

### Para Productos:

1. Ve a `/admin/products`
2. Crea o edita un producto
3. En la sección "Imágenes del Producto":
   - Puedes pegar una URL directamente en el campo de texto
   - O hacer clic en el botón de upload (📤) para seleccionar un archivo
4. La imagen se subirá automáticamente y la URL se completará

### Para Categorías:

1. Ve a `/admin/categories`
2. Crea o edita una categoría
3. En el campo "URL de Imagen":
   - Puedes pegar una URL directamente
   - O hacer clic en el botón de upload (📤) para seleccionar un archivo
4. La imagen se subirá automáticamente y la URL se completará

## 🔒 Seguridad

- Solo usuarios autenticados pueden subir imágenes
- Las imágenes son públicas para lectura (necesario para mostrarlas en el sitio)
- Las imágenes se organizan en carpetas para mejor organización
- Se valida el tipo de archivo (solo imágenes)
- Se valida el tamaño del archivo (máximo 5MB por defecto)

