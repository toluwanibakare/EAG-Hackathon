import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://lqkzuhhaxrxqlqcfmhgs.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxa3p1aGhheHJ4cWxxY2ZtaGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3ODE5MjQsImV4cCI6MjEwMzM1NzkyNH0.IEFHO2yclWW3pt5d1e4nXo6GvDaPcf-ua8jguTrhfmI'
)
