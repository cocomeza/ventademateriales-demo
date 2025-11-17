# Configuración de Información de Contacto

Esta guía te ayudará a configurar la información de contacto que se muestra en la página de contacto.

## 📋 Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Información de Contacto
NEXT_PUBLIC_CONTACT_PHONE=+54 9 11 1234-5678
NEXT_PUBLIC_WHATSAPP_NUMBER=5491112345678
NEXT_PUBLIC_CONTACT_EMAIL=contacto@materialesya.com
NEXT_PUBLIC_STORE_ADDRESS=Av. Principal 1234, Buenos Aires, Argentina

# Coordenadas del mapa (latitud y longitud)
NEXT_PUBLIC_MAP_LAT=-34.6037
NEXT_PUBLIC_MAP_LNG=-58.3816
```

## 🔧 Cómo Obtener las Coordenadas del Mapa

1. Ve a [Google Maps](https://www.google.com/maps)
2. Busca la dirección de tu local
3. Haz clic derecho en el marcador y selecciona "¿Qué hay aquí?"
4. Copia las coordenadas que aparecen (formato: latitud, longitud)
5. Agrega `NEXT_PUBLIC_MAP_LAT` y `NEXT_PUBLIC_MAP_LNG` a tu `.env.local`

**Ejemplo:**
- Si las coordenadas son: `-34.6037, -58.3816`
- Entonces:
  - `NEXT_PUBLIC_MAP_LAT=-34.6037`
  - `NEXT_PUBLIC_MAP_LNG=-58.3816`

## 📱 Formato del Número de WhatsApp

El número de WhatsApp debe estar en formato internacional sin espacios ni caracteres especiales:

- ✅ Correcto: `5491112345678` (Argentina)
- ❌ Incorrecto: `+54 9 11 1234-5678` o `11 1234-5678`

**Formato por país:**
- Argentina: `54` + código de área sin 0 + número sin espacios
- Ejemplo: `5491112345678` (54 + 911 + 12345678)

## 🌐 Configuración del Mapa

La página de contacto usa OpenStreetMap (gratis, sin necesidad de API key) para mostrar el mapa embebido. También incluye un botón para abrir la ubicación en Google Maps.

### Usar Google Maps Embebido (Opcional)

Si prefieres usar Google Maps embebido, necesitarás una API key de Google Maps:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la API de "Maps Embed API"
4. Crea una API key
5. Agrega la variable:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-aqui
   ```

Luego modifica `app/contacto/page.tsx` para usar Google Maps en lugar de OpenStreetMap.

## ✅ Verificación

Después de configurar las variables:

1. Reinicia el servidor de desarrollo (`npm run dev`)
2. Ve a `/contacto` en tu aplicación
3. Verifica que toda la información se muestre correctamente
4. Prueba los botones de WhatsApp, email y teléfono

## 📝 Notas

- Todas las variables deben comenzar con `NEXT_PUBLIC_` para que estén disponibles en el cliente
- Los valores por defecto se muestran si no se configuran las variables
- El mapa usa OpenStreetMap por defecto (gratis y sin límites)
- El botón de WhatsApp abre directamente una conversación con el número configurado

