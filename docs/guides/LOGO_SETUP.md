# Configuración del Logo

Esta guía te ayudará a agregar el logo de MaterialesYA a la aplicación.

## 📁 Ubicación del Logo

Coloca el archivo del logo en:
```
public/images/logo.materiales.jpeg
```

## 📋 Especificaciones Recomendadas

- **Formato**: JPEG
- **Tamaño mínimo**: 200x200px (se escalará automáticamente)
- **Fondo**: Transparente o con fondo naranja (#FF6600)
- **Resolución**: Alta resolución para mejor calidad en diferentes tamaños

## ✅ Verificación

Una vez que hayas colocado el logo:

1. Reinicia el servidor de desarrollo (`npm run dev`)
2. Verifica que el logo aparezca en el navbar
3. Si el logo no se carga, se mostrará automáticamente un SVG de fallback

## 🎨 Uso del Componente Logo

El componente `Logo` está disponible para usar en cualquier parte de la aplicación:

```tsx
import { Logo } from "@/components/logo";

// Logo completo (imagen + texto)
<Logo showText={true} size="md" />

// Solo imagen del logo
<Logo showText={false} size="lg" />

// Tamaños disponibles: "sm", "md", "lg"
```

## 🔄 Fallback Automático

Si el archivo `logo.materiales.jpeg` no existe o no se puede cargar, el componente mostrará automáticamente un SVG de fallback que representa el logo hexagonal de MaterialesYA con elementos de construcción.

## 📝 Notas

- El logo se carga con `priority` para una carga rápida en el navbar
- El componente maneja errores automáticamente y muestra el SVG de fallback
- El texto del logo usa el color primario para "YA" y el color de texto por defecto para "materiales"

