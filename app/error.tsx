'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Enviar error a Sentry solo si está configurado
    try {
      const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
      if (dsn && dsn !== 'https://tu-dsn@sentry.io/tu-proyecto-id' && dsn.startsWith('https://')) {
        Sentry.captureException(error);
      }
    } catch (e) {
      // Silenciar errores de Sentry
    }
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4">500</h1>
        <h2 className="text-2xl font-semibold mb-4">Algo salió mal</h2>
        <p className="text-muted-foreground mb-8">
          Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

