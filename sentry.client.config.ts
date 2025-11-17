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
    
    // Replays on error: 100% en desarrollo, 10% en producción
    replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay: 10% en desarrollo, 1% en producción
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
    
    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      Sentry.replayIntegration({
        // Additional Replay configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],
    
    // Ignore errores comunes que no necesitamos rastrear
    ignoreErrors: [
      // Errores de navegador comunes
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Errores de red que son esperados
      'NetworkError',
      'Failed to fetch',
      // Errores de Supabase cuando no está configurado
      'Invalid API key',
    ],
    
    // Filtrar transacciones
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
} else {
  // Silenciar Sentry cuando no está configurado
  if (typeof window !== 'undefined') {
    // Crear un objeto mock para evitar errores
    (window as any).__SENTRY_INIT__ = false;
  }
}

