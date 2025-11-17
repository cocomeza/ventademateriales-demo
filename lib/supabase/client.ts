import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Crear cliente solo si las variables están configuradas correctamente
let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key') {
  try {
    // Validar que la URL y la clave tengan el formato correcto
    if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
      console.error('NEXT_PUBLIC_SUPABASE_URL debe comenzar con http:// o https://')
    } else if (supabaseAnonKey.length < 20) {
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY parece ser inválida (muy corta)')
    } else {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error)
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('Supabase no está configurado. Verifica tus variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

export { supabase }

export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
    return false
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
    return false
  }
  return supabase !== null
}

