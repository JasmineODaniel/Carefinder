import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--color-panel);font-family:sans-serif;color:var(--color-surface);text-align:center;padding:2rem">
      <div>
        <p style="font-size:1.25rem;font-weight:600;margin-bottom:.5rem">Configuration error</p>
        <p style="color:var(--color-soft);font-size:.875rem">VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your deployment environment.</p>
      </div>
    </div>`
  throw new Error('Supabase environment variables are not configured.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
