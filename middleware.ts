import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://www.openstreetmap.org",
    "frame-ancestors 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Manejar autenticación de Supabase
  if (supabaseUrl && supabaseAnonKey) {
    // Leer cookies de sesión sincronizadas
    const accessTokenCookie = request.cookies.get('sb-access-token');
    const refreshTokenCookie = request.cookies.get('sb-refresh-token');
    
    // Si tenemos tokens sincronizados, establecerlos en el formato que Supabase espera
    if (accessTokenCookie) {
      const accessToken = decodeURIComponent(accessTokenCookie.value);
      
      // Obtener el project ref de la URL
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
      
      if (projectRef) {
        // Establecer la cookie en el formato estándar de Supabase para que el servidor la pueda leer
        // Usar el formato: sb-{project-ref}-auth-token
        const supabaseCookieName = `sb-${projectRef}-auth-token`;
        
        // Crear el objeto de sesión que Supabase espera
        const sessionData = {
          access_token: accessToken,
          refresh_token: refreshTokenCookie ? decodeURIComponent(refreshTokenCookie.value) : accessToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hora desde ahora
          expires_in: 3600,
          token_type: 'bearer',
          user: null, // Se obtendrá del token
        };
        
        // Establecer la cookie en el formato que Supabase espera
        response.cookies.set(supabaseCookieName, JSON.stringify(sessionData), {
          path: '/',
          maxAge: 3600,
          sameSite: 'lax',
          httpOnly: false, // Debe ser false para que el cliente pueda leerla también
          secure: request.nextUrl.protocol === 'https:',
        });
        
        // También establecer las cookies de sincronización para mantenerlas actualizadas
        response.cookies.set('sb-access-token', accessTokenCookie.value, {
          path: '/',
          maxAge: 3600,
          sameSite: 'lax',
          httpOnly: false,
          secure: request.nextUrl.protocol === 'https:',
        });
        
        if (refreshTokenCookie) {
          response.cookies.set('sb-refresh-token', refreshTokenCookie.value, {
            path: '/',
            maxAge: 604800, // 7 días
            sameSite: 'lax',
            httpOnly: false,
            secure: request.nextUrl.protocol === 'https:',
          });
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

