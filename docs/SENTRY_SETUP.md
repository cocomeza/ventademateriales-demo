# Configuración de Sentry

Sentry está instalado y configurado en el proyecto para monitoreo de errores y rendimiento.

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local`:

```bash
# Sentry DSN (obligatorio para que funcione)
NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn@sentry.io/tu-proyecto-id

# Opcional: Organización y Proyecto de Sentry (para source maps)
SENTRY_ORG=tu-organizacion
SENTRY_PROJECT=materialesya

# Opcional: Release version (para tracking de versiones)
NEXT_PUBLIC_SENTRY_RELEASE=1.0.0
```

## Cómo Obtener tu DSN de Sentry

1. Ve a [sentry.io](https://sentry.io) y crea una cuenta o inicia sesión
2. Crea un nuevo proyecto seleccionando "Next.js"
3. Copia el DSN que te proporciona Sentry
4. Pega el DSN en tu archivo `.env.local` como `NEXT_PUBLIC_SENTRY_DSN`

## Configuración Actual

### Cliente (Browser)
- **Traces Sample Rate**: 100% en desarrollo, 10% en producción
- **Session Replay**: Habilitado con máscara de texto y medios
- **Browser Tracing**: Habilitado para monitoreo de rendimiento

### Servidor (Node.js)
- **Traces Sample Rate**: 100% en desarrollo, 10% en producción
- **Error Tracking**: Habilitado

### Edge Runtime
- **Traces Sample Rate**: 100% en desarrollo, 10% en producción
- **Error Tracking**: Habilitado

## Características Habilitadas

### 1. Error Tracking
- Captura automática de errores de JavaScript
- Errores de servidor y cliente
- Stack traces completos con source maps

### 2. Performance Monitoring
- Monitoreo de transacciones
- Tiempo de carga de páginas
- Métricas de API

### 3. Session Replay
- Grabación de sesiones cuando ocurren errores
- Máscara automática de texto sensible
- Bloqueo de medios para privacidad

### 4. Source Maps
- Upload automático de source maps en build
- Mejor debugging con código original
- Oculto en bundles de producción

## Uso Manual

Puedes capturar errores manualmente en tu código:

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // Tu código
} catch (error) {
  Sentry.captureException(error);
  // Manejo del error
}
```

O agregar contexto adicional:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.setUser({
  id: user.id,
  email: user.email,
});

Sentry.setTag("page", "product-detail");
Sentry.setContext("product", {
  id: product.id,
  name: product.name,
});
```

## Errores Ignorados

Los siguientes errores se ignoran automáticamente (son comunes y no críticos):

- `ResizeObserver loop limit exceeded`
- `Non-Error promise rejection captured`
- `NetworkError`
- `Failed to fetch`
- `ECONNREFUSED`
- `ENOTFOUND`
- `ETIMEDOUT`

## Desarrollo vs Producción

### Desarrollo
- `tracesSampleRate: 1.0` (100% de las transacciones)
- `replaysSessionSampleRate: 0.1` (10% de las sesiones)
- `debug: true` (logs detallados)

### Producción
- `tracesSampleRate: 0.1` (10% de las transacciones)
- `replaysSessionSampleRate: 0.01` (1% de las sesiones)
- `debug: false` (sin logs)

## Verificación

Para verificar que Sentry está funcionando:

1. Asegúrate de tener `NEXT_PUBLIC_SENTRY_DSN` configurado
2. Reinicia el servidor de desarrollo
3. Provoca un error intencionalmente (por ejemplo, en la consola del navegador: `throw new Error("Test")`)
4. Ve a tu dashboard de Sentry y deberías ver el error

## Troubleshooting

### Sentry no está capturando errores

1. Verifica que `NEXT_PUBLIC_SENTRY_DSN` esté configurado correctamente
2. Verifica que el DSN sea válido y tenga permisos
3. Revisa la consola del navegador para errores de conexión
4. Asegúrate de que no haya bloqueadores de anuncios bloqueando Sentry

### Source maps no funcionan

1. Verifica que `SENTRY_ORG` y `SENTRY_PROJECT` estén configurados
2. Ejecuta `npm run build` para generar source maps
3. Los source maps se suben automáticamente durante el build

### Errores en desarrollo

Sentry está configurado para no enviar errores si no hay DSN configurado, así que no deberías ver errores en desarrollo local sin Sentry configurado.

## Recursos

- [Documentación de Sentry para Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Dashboard de Sentry](https://sentry.io)

