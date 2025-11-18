'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Please set it in your .env.local file.'
  )
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please set it in your .env.local file.'
  )
}

export async function createClient() {
  const cookieStore = await cookies()
  
  // Obtener el project ref de la URL
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
  const supabaseCookieName = projectRef ? `sb-${projectRef}-auth-token` : null
  
  // Intentar leer la cookie estándar de Supabase primero (establecida por el middleware)
  let sessionData: { access_token: string; refresh_token: string } | null = null
  
  if (supabaseCookieName) {
    const supabaseCookie = cookieStore.get(supabaseCookieName)
    if (supabaseCookie) {
      try {
        const parsed = JSON.parse(supabaseCookie.value)
        if (parsed.access_token) {
          sessionData = {
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token || parsed.access_token,
          }
        }
      } catch (e) {
        // Si no es JSON, intentar leer como string directo
        console.log('Cookie is not JSON, trying as string')
      }
    }
  }
  
  // Si no encontramos la cookie estándar, intentar con las cookies sincronizadas
  if (!sessionData) {
    const accessTokenCookie = cookieStore.get('sb-access-token')
    const refreshTokenCookie = cookieStore.get('sb-refresh-token')
    
    if (accessTokenCookie) {
      sessionData = {
        access_token: decodeURIComponent(accessTokenCookie.value),
        refresh_token: refreshTokenCookie ? decodeURIComponent(refreshTokenCookie.value) : decodeURIComponent(accessTokenCookie.value),
      }
    }
  }
  
  console.log('Server: Reading cookies', {
    hasSupabaseCookie: !!supabaseCookieName && !!cookieStore.get(supabaseCookieName || ''),
    hasAccessTokenCookie: !!cookieStore.get('sb-access-token'),
    hasSessionData: !!sessionData,
    allCookies: cookieStore.getAll().map(c => c.name).join(', ')
  })
  
  // Crear cliente con el token si está disponible
  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: sessionData?.access_token ? {
        Authorization: `Bearer ${sessionData.access_token}`,
      } : {},
    },
    auth: {
      storage: {
        getItem: (key: string) => {
          // Leer de cookies sincronizadas
          if (key.includes('access_token') && sessionData?.access_token) {
            return sessionData.access_token
          }
          if (key.includes('refresh_token') && sessionData?.refresh_token) {
            return sessionData.refresh_token
          }
          
          // Intentar leer cookies estándar de Supabase
          const cookie = cookieStore.get(key)
          if (cookie) return cookie.value
          
          // Intentar con el formato estándar de Supabase
          if (supabaseCookieName) {
            const supabaseCookie = cookieStore.get(supabaseCookieName)
            if (supabaseCookie) {
              try {
                const parsed = JSON.parse(supabaseCookie.value)
                if (key.includes('access_token')) return parsed.access_token
                if (key.includes('refresh_token')) return parsed.refresh_token
                return supabaseCookie.value
              } catch {
                return supabaseCookie.value
              }
            }
          }
          
          return null
        },
        setItem: async (key: string, value: string) => {
          // Las cookies se establecen en el cliente y middleware
        },
        removeItem: async (key: string) => {
          // Las cookies se eliminan en el cliente
        },
      },
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  
  // Si tenemos un token, establecerlo en el cliente usando setSession
  if (sessionData?.access_token) {
    try {
      console.log('Server: Setting session from cookies', {
        hasAccessToken: !!sessionData.access_token,
        hasRefreshToken: !!sessionData.refresh_token
      })
      
      const { data: { session }, error } = await client.auth.setSession({
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
      })
      
      if (error) {
        console.error('Error setting session from cookie:', error.message, error)
      } else if (session) {
        console.log('Server: Session set successfully', {
          userEmail: session.user?.email,
          userId: session.user?.id
        })
      }
    } catch (error: any) {
      console.error('Error in setSession:', error?.message || error)
    }
  } else {
    console.log('Server: No access token found in cookies')
  }
  
  return client
}

