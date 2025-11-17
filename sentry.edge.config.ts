import * as Sentry from "@sentry/nextjs";

// Verificar si el DSN es válido (no es un placeholder)
const isValidDsn = process.env.NEXT_PUBLIC_SENTRY_DSN && 
  process.env.NEXT_PUBLIC_SENTRY_DSN !== 'https://tu-dsn@sentry.io/tu-proyecto-id' &&
  process.env.NEXT_PUBLIC_SENTRY_DSN.startsWith('https://') &&
  process.env.NEXT_PUBLIC_SENTRY_DSN.includes('@');

// Solo inicializar Sentry si el DSN es válido
if (isValidDsn) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // En desarrollo: 1.0 (100%), en producción: 0.1 (10%)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Environment
    environment: process.env.NODE_ENV || 'development',
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    
    // Filtrar eventos antes de enviar
    beforeSend(event, hint) {
      // Filtrar errores de Supabase cuando no está configurado
      if (event.exception) {
        const errorMessage = event.exception.values?.[0]?.value || '';
        if (errorMessage.includes('Invalid API key') || errorMessage.includes('Invalid DSN')) {
          return null;
        }
      }
      return event;
    },
  });
}

