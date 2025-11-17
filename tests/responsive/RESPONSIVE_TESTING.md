# Tests de Responsividad de Cards

Este test automatizado verifica que las cards de productos se muestren correctamente en todos los dispositivos y tamaños de pantalla.

## ¿Qué verifica este test?

### 1. **Verificación de Cards en Diferentes Dispositivos**
- ✅ Visibilidad de las cards
- ✅ Dimensiones apropiadas (ancho y alto)
- ✅ Prevención de overflow horizontal
- ✅ Imágenes visibles y con tamaño adecuado
- ✅ Botones clickeables y visibles
- ✅ Texto legible (tamaño de fuente mínimo)
- ✅ Precio visible

### 2. **Verificación del Carrusel**
- ✅ Visibilidad del carrusel
- ✅ Botones de navegación funcionando
- ✅ Scroll horizontal cuando es necesario
- ✅ Número correcto de productos visibles según el tamaño de pantalla

### 3. **Verificación de Espaciado**
- ✅ Gaps apropiados entre cards (8px - 48px)
- ✅ Espaciado consistente en todos los dispositivos

### 4. **Prevención de Recorte**
- ✅ Cards no cortadas por los bordes
- ✅ Contenido interno dentro de los límites de la card

### 5. **Screenshots Visuales**
- 📸 Captura screenshots en dispositivos clave para revisión manual

## Dispositivos Probados

- **Mobile**: iPhone SE (375x667), iPhone 12 Pro (390x844), iPhone 14 Pro Max (430x932)
- **Tablet**: iPad Mini (768x1024), iPad Air (820x1180), iPad Pro (1024x1366)
- **Notebook**: Pequeño (1024x768), Estándar (1280x800), Grande (1366x768)
- **Desktop**: Pequeño (1440x900), Estándar (1920x1080), Grande (2560x1440)

## Cómo ejecutar

```bash
# Ejecutar todos los tests de responsividad
npm run test:responsive

# Ejecutar solo el test de cards
npm run test:responsive:cards

# Con UI interactiva
npx playwright test tests/responsive/cards-responsiveness.spec.ts --ui

# Con modo headed (ver el navegador)
npx playwright test tests/responsive/cards-responsiveness.spec.ts --headed
```

## Interpretación del Reporte

### ✅ Sin Problemas
Si no hay problemas, verás:
```
✅ Todas las cards se muestran correctamente en todos los dispositivos
```

### ⚠️ Problemas Encontrados
El test generará un reporte detallado con:
- **Dispositivo afectado**: Qué dispositivo tiene el problema
- **Tipo de problema**: Descripción del issue
- **Detalles**: Información adicional (dimensiones, etc.)

### Ejemplo de Salida

```
📱 REPORTE DE RESPONSIVIDAD DE CARDS
================================================================================

⚠️  Se encontraron 3 problemas:

📱 Notebook estándar:
   ❌ Card 1 es demasiado estrecha (145px)
      Detalles: { width: 145 }
   ❌ Card 2 tiene overflow horizontal
      Detalles: { scrollWidth: 200, clientWidth: 180 }

📱 iPad Mini:
   ❌ Card 1 tiene texto muy pequeño (11.2px)
      Detalles: { fontSize: 11.2 }

================================================================================
💡 RECOMENDACIONES:
================================================================================

📏 Problemas de ancho:
   - Considera usar min-width y max-width en las cards
   - Verifica que el carrusel maneje correctamente diferentes anchos

📦 Problemas de overflow:
   - Asegúrate de que el contenido de las cards use word-break
   - Verifica que los textos largos se trunquen con line-clamp
   - Considera reducir padding en pantallas pequeñas
```

## Mejoras Sugeridas por el Test

El test proporciona recomendaciones específicas basadas en los problemas encontrados:

1. **Problemas de ancho**: Sugiere usar `min-width` y `max-width`
2. **Problemas de overflow**: Sugiere `word-break` y `line-clamp`
3. **Problemas de texto**: Sugiere tamaños de fuente responsivos

## Screenshots

Los screenshots se guardan en `tests/screenshots/` con nombres como:
- `cards-mobile.png`
- `cards-tablet.png`
- `cards-notebook.png`
- `cards-desktop.png`

## Solución de Problemas Comunes

### Cards muy estrechas
- Aumentar el `min-width` en el componente del carrusel
- Verificar que el ancho fijo no sea demasiado pequeño

### Overflow horizontal
- Agregar `overflow-hidden` al contenedor de la card
- Usar `line-clamp` para textos largos
- Reducir padding en pantallas pequeñas

### Texto muy pequeño
- Usar clases responsivas de Tailwind: `text-sm sm:text-base`
- Verificar que los tamaños de fuente sean legibles (mínimo 12px)

### Cards cortadas
- Verificar que el contenedor tenga `overflow-hidden`
- Asegurar que el padding no cause overflow
- Verificar que los elementos hijos respeten los límites del padre

## Integración Continua

Este test puede ejecutarse en CI/CD para asegurar que los cambios no rompan la responsividad:

```yaml
# Ejemplo para GitHub Actions
- name: Test Responsividad
  run: npm run test:responsive:cards
```

