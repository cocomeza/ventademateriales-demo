# Instrucciones para la Imagen del Banner

## Ubicación del Archivo

Coloca la imagen del banner promocional en:
```
public/images/banner-hero.jpg
```

## Especificaciones Recomendadas

### Dimensiones
- **Ancho**: 1920px (o mayor para pantallas grandes)
- **Alto**: 600px - 800px
- **Ratio**: 16:5 o 3:1 aproximadamente

### Formato
- **Formato**: JPG (recomendado) o WebP (mejor compresión)
- **Tamaño**: < 500KB para mejor performance
- **Calidad**: 80-85% (balance entre calidad y tamaño)

### Contenido Sugerido

La imagen debería mostrar materiales de construcción, por ejemplo:
- Materiales apilados (cemento, ladrillos, arena)
- Obra en construcción
- Herramientas profesionales
- Ambiente de construcción/obra
- Colores que combinen con el tema naranja de la marca

### Ejemplos de Temas

1. **Materiales apilados**: Cemento, ladrillos, arena organizados
2. **Obra en construcción**: Edificio o casa en construcción
3. **Herramientas**: Herramientas profesionales de construcción
4. **Trabajador**: Persona trabajando con materiales
5. **Almacén**: Vista de almacén con materiales organizados

## Servicios de Imágenes Gratuitas

- **Unsplash**: https://unsplash.com/s/photos/construction-materials
- **Pexels**: https://www.pexels.com/search/construction/
- **Pixabay**: https://pixabay.com/images/search/construction/

### Búsquedas Recomendadas
- "construction materials"
- "building materials"
- "construction site"
- "cement bricks"
- "construction tools"

## Instrucciones de Uso

1. Descarga o crea una imagen siguiendo las especificaciones
2. Nómbrala `banner-hero.jpg`
3. Colócala en `public/images/banner-hero.jpg`
4. La imagen aparecerá automáticamente en el banner principal

## Fallback

Si no hay imagen o hay un error al cargarla, el banner mostrará automáticamente:
- Un gradiente naranja vibrante
- Patrón decorativo de puntos
- Elementos SVG sutiles de herramientas y construcción

## Verificación

Para verificar que la imagen se está cargando:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Busca `banner-hero.jpg` en la lista
5. Verifica que se cargue correctamente (status 200)

Si la imagen no se carga, el banner mostrará automáticamente el diseño de fallback con gradiente naranja.

