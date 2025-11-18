"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiples envíos
    if (loading) {
      return;
    }
    
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error de Configuración",
        description: "Supabase no está configurado. Por favor configura las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local",
        variant: "destructive",
        duration: 10000,
      });
      return;
    }

    setLoading(true);

    try {
      // Verificar que Supabase está configurado correctamente
      if (!supabase) {
        toast({
          title: "Error de configuración",
          description: "Supabase no está configurado. Verifica las variables de entorno.",
          variant: "destructive",
        });
        return;
      }

      // Validar email antes de intentar login
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !password) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Intentando iniciar sesión con:", trimmedEmail);
      console.log("Supabase cliente disponible:", !!supabase);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });
      
      console.log("Respuesta de login - Error:", error?.message || "ninguno");
      console.log("Respuesta de login - Usuario:", data?.user?.email || "ninguno");
      console.log("Respuesta de login - Sesión:", data?.session ? "existe" : "no existe");

      if (error) {
        // Log del error completo para debugging
        console.error("Error de autenticación completo:", {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        // Mensajes de error más específicos
        let errorMessage = "Error al iniciar sesión";
        let errorTitle = "Error de autenticación";
        
        // Error de API key inválida
        if (error.message.includes("Invalid API key") || error.status === 401) {
          errorTitle = "Error de Configuración";
          errorMessage = "La clave de API de Supabase no es válida. Verifica que NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local sea correcta. Ve a Supabase Dashboard > Settings > API para obtener la clave correcta.";
        } else if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
          errorTitle = "Credenciales Inválidas";
          errorMessage = "Email o contraseña incorrectos. Verifica tus credenciales o crea una cuenta nueva. Si el usuario existe, verifica que esté confirmado en Supabase Dashboard > Authentication > Users.";
        } else if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
          errorMessage = "Por favor confirma tu email antes de iniciar sesión. Ve a Supabase Dashboard > Authentication > Users y confirma tu usuario.";
        } else if (error.message.includes("User not found") || error.message.includes("user_not_found")) {
          errorMessage = "Usuario no encontrado. Verifica que el email es correcto o crea una cuenta nueva.";
        } else if (error.status === 400) {
          errorMessage = `Error 400: ${error.message || "Credenciales inválidas o usuario no confirmado"}`;
        } else {
          errorMessage = error.message || `Error ${error.status || 'desconocido'} al iniciar sesión`;
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
          duration: 10000, // Mostrar por más tiempo si es error de configuración
        });
        return;
      }

      if (data?.user) {
        console.log("Login exitoso, usuario:", data.user.email);
        console.log("Datos de sesión:", data.session);
        
        // Verificar que la sesión esté activa inmediatamente
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Sesión obtenida:", sessionData?.session?.user?.email);
        console.log("Error al obtener sesión:", sessionError);
        
        if (sessionData?.session || data.session) {
          const activeSession = sessionData?.session || data.session;
          console.log("Sesión activa confirmada:", activeSession?.user?.email);

      toast({
        title: "Sesión iniciada",
            description: `Bienvenido de vuelta, ${data.user.email}`,
      });

          // Esperar un momento para que el estado se propague
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Redirigir
      router.push("/");
      router.refresh();
          
          // Forzar recarga después de un momento para asegurar que todo se actualice
          setTimeout(() => {
            window.location.href = "/";
          }, 800);
        } else {
          console.error("No se pudo obtener la sesión después del login");
          toast({
            title: "Error",
            description: "La sesión no se estableció correctamente. Intenta nuevamente.",
            variant: "destructive",
          });
        }
      } else {
        console.error("No se recibió información del usuario en la respuesta");
        toast({
          title: "Error",
          description: "No se pudo obtener la información del usuario",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Error inesperado al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <CardTitle className="text-3xl">Iniciar Sesión</CardTitle>
        <CardDescription className="text-base mt-2">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 border-primary/20 focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
            <div className="relative">
            <Input
              id="password"
                type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
                className="pr-10 h-11 border-primary/20 focus:border-primary focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          <div className="text-sm text-center space-y-2 w-full">
            <p className="text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
            <p>
              <Link href="/auth/reset-password" className="text-primary font-semibold hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

