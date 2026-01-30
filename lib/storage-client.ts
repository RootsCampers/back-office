import { createClient } from '@supabase/supabase-js'

// This client is strictly for Storage operations, pointing to the original Supabase instance (port 54321)
// independent of the Auth URL (port 9999)
const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:54321'
const storageKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!storageKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY for storage client')
}

export const storageClient = createClient(storageUrl, storageKey, {
    auth: {
        persistSession: false, // We don't need auth session persistence for this utility client
        autoRefreshToken: false,
    }
})
