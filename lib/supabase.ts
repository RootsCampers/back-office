import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseAuthUrl = process.env.NEXT_PUBLIC_AUTH_URL

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(supabaseAuthUrl ? { url: supabaseAuthUrl } : {}),
    persistSession: true,
    autoRefreshToken: true,
  }
})

export const createSupabaseClient = () => {
  console.log('Creating Supabase Client with:', {
    authUrl: supabaseAuthUrl,
    defaultUrl: supabaseUrl,
    effectiveUrl: supabaseAuthUrl || supabaseUrl
  })
  return createClientComponentClient({
    supabaseUrl: supabaseAuthUrl || supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
}