"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { supabase } from "@/lib/supabase/client";

export function SupabaseConfigCheck() {
  const [configStatus, setConfigStatus] = useState<{
    url: { configured: boolean; valid: boolean };
    key: { configured: boolean; valid: boolean };
    connection: { status: "checking" | "success" | "error"; message?: string };
  }>({
    url: { configured: false, valid: false },
    key: { configured: false, valid: false },
    connection: { status: "checking" },
  });

  useEffect(() => {
    const checkConfig = async () => {
      // Las variables NEXT_PUBLIC_ están disponibles en el cliente
      // Accedemos a ellas a través de window o directamente
      const url = typeof window !== 'undefined' 
        ? (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
        : '';
      const key = typeof window !== 'undefined'
        ? (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : '';

      // Verificar URL
      const urlConfigured = !!url && url !== 'your_supabase_url';
      const urlValid = urlConfigured && (url.startsWith('http://') || url.startsWith('https://'));

      // Verificar Key
      const keyConfigured = !!key && key !== 'your_supabase_anon_key';
      const keyValid = keyConfigured && key.length > 20;

      setConfigStatus({
        url: { configured: urlConfigured, valid: urlValid },
        key: { configured: keyConfigured, valid: keyValid },
        connection: { status: "checking" },
      });

      // Verificar conexión si ambas están configuradas
      if (urlValid && keyValid && isSupabaseConfigured() && supabase) {
        try {
          // Intentar una query simple para verificar la conexión
          const { data, error } = await supabase
            .from("products")
            .select("id")
            .limit(1);

          if (error) {
            if (error.message?.includes("Invalid API key") || error.message?.includes("JWT")) {
              setConfigStatus((prev) => ({
                ...prev,
                connection: {
                  status: "error",
                  message: "Clave API inválida. Verifica que NEXT_PUBLIC_SUPABASE_ANON_KEY sea correcta en tu archivo .env.local",
                },
              }));
            } else {
              setConfigStatus((prev) => ({
                ...prev,
                connection: {
                  status: "error",
                  message: `Error: ${error.message}`,
                },
              }));
            }
          } else {
            setConfigStatus((prev) => ({
              ...prev,
              connection: { status: "success", message: "Conexión exitosa con Supabase" },
            }));
          }
        } catch (error: any) {
          setConfigStatus((prev) => ({
            ...prev,
            connection: {
              status: "error",
              message: `Error de conexión: ${error.message}`,
            },
          }));
        }
      } else {
        setConfigStatus((prev) => ({
          ...prev,
          connection: {
            status: "error",
            message: "Configura las variables de entorno primero",
          },
        }));
      }
    };

    checkConfig();
  }, []);

  return (
    <Card className="mb-6 border-yellow-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Diagnóstico de Configuración de Supabase
        </CardTitle>
        <CardDescription>
          Verifica que las variables de entorno estén configuradas correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Status */}
        <div className="flex items-center gap-2">
          {configStatus.url.configured && configStatus.url.valid ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL</p>
            <p className="text-sm text-muted-foreground">
              {configStatus.url.configured
                ? configStatus.url.valid
                  ? "✓ Configurada correctamente"
                  : "✗ Debe comenzar con http:// o https://"
                : "✗ No configurada"}
            </p>
          </div>
        </div>

        {/* Key Status */}
        <div className="flex items-center gap-2">
          {configStatus.key.configured && configStatus.key.valid ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            <p className="text-sm text-muted-foreground">
              {configStatus.key.configured
                ? configStatus.key.valid
                  ? "✓ Configurada correctamente"
                  : "✗ Parece ser inválida (muy corta)"
                : "✗ No configurada"}
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <Alert
          variant={
            configStatus.connection.status === "success"
              ? "default"
              : configStatus.connection.status === "error"
              ? "destructive"
              : "default"
          }
        >
          {configStatus.connection.status === "checking" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Verificando conexión...</AlertTitle>
            </>
          ) : configStatus.connection.status === "success" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>✓ Conexión exitosa</AlertTitle>
              <AlertDescription>{configStatus.connection.message}</AlertDescription>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <AlertTitle>✗ Error de conexión</AlertTitle>
              <AlertDescription>{configStatus.connection.message}</AlertDescription>
            </>
          )}
        </Alert>

        {/* Instructions */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold mb-2">Cómo solucionar:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Crea un archivo <code className="bg-background px-1 rounded">.env.local</code> en la raíz del proyecto</li>
            <li>
              Ve a{" "}
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Supabase Dashboard
              </a>{" "}
              → Settings → API
            </li>
            <li>Copia la <strong>Project URL</strong> como <code>NEXT_PUBLIC_SUPABASE_URL</code></li>
            <li>Copia la <strong>anon/public key</strong> como <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
            <li>Reinicia el servidor de desarrollo (Ctrl+C y luego <code>npm run dev</code>)</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

