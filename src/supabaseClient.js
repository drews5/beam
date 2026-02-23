import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Mailing list will not function correctly until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.')
}

// Ensure createClient is only called with valid-looking strings to prevent runtime crashes
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : { from: () => ({ insert: async () => ({ error: new Error('Supabase not configured') }) }) }

