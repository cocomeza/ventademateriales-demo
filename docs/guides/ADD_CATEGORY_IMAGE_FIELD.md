# Agregar Campo de Imagen a Categorías

Este documento explica cómo agregar el campo `image_url` a la tabla `categories` en Supabase para permitir imágenes descriptivas en las categorías.

## Paso 1: Acceder a Supabase Dashboard

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Navega a **SQL Editor** en el menú lateral

## Paso 2: Ejecutar la Migración SQL

Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Agregar columna image_url a la tabla categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Agregar comentario para documentación
COMMENT ON COLUMN categories.image_url IS 'URL de la imagen descriptiva de la categoría (se muestra en el home)';
```

## Paso 3: Verificar la Migración

Para verificar que la columna se agregó correctamente, ejecuta:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'categories' 
AND column_name = 'image_url';
```

Deberías ver que `image_url` es de tipo `TEXT` y `is_nullable` es `YES`.

## Paso 4: Usar la Funcionalidad

Una vez agregado el campo:

1. **Desde el Admin Panel:**
   - Ve a `/admin/categories`
   - Edita cualquier categoría
   - Verás un nuevo campo "URL de Imagen"
   - Ingresa la URL de la imagen (puede ser una URL externa o una URL de Supabase Storage)
   - Se mostrará una vista previa de la imagen mientras escribes
   - Guarda los cambios

2. **Las imágenes se mostrarán automáticamente:**
   - En el home (`/`) en la sección "Categorías Destacadas"
   - Las categorías con imagen mostrarán la imagen en lugar de la letra inicial

## Opciones para Almacenar Imágenes

### Opción 1: URLs Externas
Puedes usar URLs de servicios como:
- Imgur
- Cloudinary
- ImgBB
- Cualquier servicio de hosting de imágenes

### Opción 2: Supabase Storage (Recomendado)
Para usar Supabase Storage:

1. Ve a **Storage** en el Dashboard de Supabase
2. Crea un bucket llamado `category-images` (o el nombre que prefieras)
3. Configura las políticas de acceso según necesites
4. Sube las imágenes
5. Copia la URL pública de cada imagen y úsala en el campo `image_url`

Ejemplo de URL de Supabase Storage:
```
https://[tu-proyecto].supabase.co/storage/v1/object/public/category-images/aislantes.jpg
```

## Notas

- El campo `image_url` es opcional (puede ser `NULL`)
- Si una categoría no tiene imagen, se mostrará la letra inicial como antes
- Las imágenes deben ser accesibles públicamente para mostrarse correctamente
- Se recomienda usar imágenes con relación de aspecto 16:9 o 4:3 para mejor visualización

