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
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          const cookie = cookieStore.get(key)
          return cookie?.value ?? null
        },
        setItem: async (key: string, value: string) => {
          // Note: In Next.js App Router, cookies are read-only in server components
          // This is a simplified implementation
        },
        removeItem: async (key: string) => {
          // Note: In Next.js App Router, cookies are read-only in server components
        },
      },
    },
  })
}

