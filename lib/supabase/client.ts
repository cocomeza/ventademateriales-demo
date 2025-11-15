import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Crear cliente solo si las variables están configuradas correctamente
let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Error creating Supabase client:', error)
  }
}

export { supabase }

export function isSupabaseConfigured(): boolean {
  return supabase !== null
}

