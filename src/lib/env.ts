import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ')
  throw new Error(
    `❌ Missing or invalid env vars: ${missing}\n` +
      `→ Run: cp .env.example .env\n` +
      `→ Fill in your Supabase credentials from: https://supabase.com/dashboard/project/_/settings/api`,
  )
}

export const env = parsed.data
