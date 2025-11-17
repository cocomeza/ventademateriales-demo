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

    // Adjust this value in production, or use tracesSampler for greater control
    // En desarrollo: 1.0 (100%), en producción: 0.1 (10%)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false, // Deshabilitado para evitar logs innecesarios
    
    // Environment
    environment: process.env.NODE_ENV || 'development',
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    
    // Ignore errores comunes
    ignoreErrors: [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'Invalid API key',
    ],
    
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

