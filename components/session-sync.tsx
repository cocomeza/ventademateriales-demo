'use client'

import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

/**
 * Componente que sincroniza la sesión de Supabase con cookies
 * para que el servidor pueda acceder a la sesión
 */
export function SessionSync() {
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    // Función para sincronizar la sesión con cookies
    const syncSessionToCookies = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.access_token) {
          // Establecer cookies con los tokens
          const maxAge = 3600 // 1 hora para access token
          const refreshMaxAge = 604800 // 7 días para refresh token
          
          // Usar encodeURIComponent para asegurar que los tokens se almacenen correctamente
          const accessTokenCookie = `sb-access-token=${encodeURIComponent(session.access_token)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`
          document.cookie = accessTokenCookie
          
          if (session.refresh_token) {
            const refreshTokenCookie = `sb-refresh-token=${encodeURIComponent(session.refresh_token)}; path=/; max-age=${refreshMaxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`
            document.cookie = refreshTokenCookie
          }
          
          console.log('Session synced to cookies:', {
            hasAccessToken: !!session.access_token,
            hasRefreshToken: !!session.refresh_token,
            userEmail: session.user?.email
          })
        } else {
          // Si no hay sesión, eliminar cookies
          document.cookie = 'sb-access-token=; path=/; max-age=0'
          document.cookie = 'sb-refresh-token=; path=/; max-age=0'
          console.log('Session cleared, cookies removed')
        }
      } catch (error) {
        console.error('Error syncing session to cookies:', error)
      }
    }

    // Sincronizar inmediatamente
    syncSessionToCookies()

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      syncSessionToCookies()
    })

    // Sincronizar periódicamente (cada minuto) para mantener las cookies actualizadas
    const interval = setInterval(syncSessionToCookies, 60000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return null // Este componente no renderiza nada
}

